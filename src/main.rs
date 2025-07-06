use axum::{
    extract::Path, http::{header, Response, StatusCode}, response::IntoResponse, routing::{
        delete, get, post, put
    }, Json, Router
};
use todo_rs::models::{StatusEnum, StatusResponse, TodoWithStatus};
use tower_http::trace::TraceLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use std::net::SocketAddr;
use tokio::net::TcpListener;
use todo_rs::db::models::{NewTodo, Todo};
use todo_rs::connection::{
    create_todo,
    delete_todo,
    get_todos,
    get_todo_by_id,
    MIGRATIONS,
    establish_connection
};
use diesel_migrations::{MigrationHarness};
use mime_guess;
use rust_embed::RustEmbed;
#[derive(RustEmbed)]
#[folder = "ui/out"]
struct NextStatic;

async fn static_handler(path: axum::extract::Path<String>) -> impl IntoResponse {
    println!("Static file requested: {:#?}", path);
    let path = if path.is_empty() {
        "index.html".to_string()
    } else {
        path.to_string()
    };

    match NextStatic::get(&path) {
        Some(content) => {
            let body = content.data.into_owned();
            let mime = mime_guess::from_path(path).first_or_octet_stream();
            Response::builder()
                .header(header::CONTENT_TYPE, mime.as_ref())
                .body(axum::body::Body::from(body))
                .unwrap()
        }
        None => {
            match NextStatic::get("404.html") {
                Some(content) => {
                    let body = content.data.into_owned();
                    let mime = mime_guess::from_path(path).first_or_octet_stream();
                    Response::builder()
                        .header(header::CONTENT_TYPE, mime.as_ref())
                        .body(axum::body::Body::from(body))
                        .unwrap()
                }
                None => StatusCode::NOT_FOUND.into_response(), // Fallback to 404 page
            }
        }, // Fallback to 404 page
    }
}

async fn new_todo(
    Json(todo): Json<NewTodo>,
) -> Json<TodoWithStatus> {
    // Here you would typically insert the todo into the database
    // For now, we just return it back
    // print!("{:#?}",NewTodo);
    let result = create_todo(&todo);
    let response = match result {
        Ok(created_todo) => {
            TodoWithStatus {
                status: StatusEnum::Success,
                message: format!("Todo '{}' created successfully", created_todo.title),
                todo: Some(created_todo)
            }
        }
        Err(e) => {
            // Return an error response
            TodoWithStatus {
                status: StatusEnum::Error,
                message: format!("Error creating todo '{}': {}", todo.title, e),
                todo: None,
            }
        }
        
    };
    Json(response)
    // Json(todo)
}
async fn get_todos_handler() -> Json<Vec<Todo>> {
    // Fetch todos from the database
    let todos = get_todos();
    Json(todos)
}

async fn delete_todo_by_completed_handler() -> Json<StatusResponse> {
    // Here you would typically delete the todos from the database
    // For now, we just return a success message
    match todo_rs::connection::clear_todos_by_completed(true) {
        Ok(_) => StatusResponse {
            status: StatusEnum::Success,
            message: "All completed todos deleted successfully".to_string(),
        }.into(),
        Err(e) => {
            eprintln!("Error deleting completed todos: {}", e);
            StatusResponse {
                status: StatusEnum::Error,
                message: format!("Error deleting completed todos: {}", e),
            }.into()
        }
        
    }
}

async fn delete_todo_handler(
    Path(id): Path<i32>,
) -> Json<StatusResponse> {
    // Here you would typically delete the todo from the database
    // For now, we just return a success message
    match delete_todo(id) {
        Ok(_) =>{ StatusResponse{
                status: StatusEnum::Success,
                message: format!("Todo with id {} deleted successfully", id)
            }.into()},
        Err(e) => {
            StatusResponse{
                status: StatusEnum::Error,
                message: format!("Error deleting todo with id {}: {}", id, e),
            }.into()
        }
    }
}
async fn update_todo_handler(
    Json(todo): Json<Todo>,
) -> Json<StatusResponse> {
    // Here you would typically update the todo in the database
    // For now, we just return it back
    let title = todo.title.clone();
    match todo_rs::connection::update_todo(todo.id, NewTodo {
        title: todo.title,
        completed: todo.completed,
    }) {
        Ok(updated_todo) => {
            println!("Updated todo: {}", updated_todo.id);
            StatusResponse {
                status: StatusEnum::Success,
                message: format!("Todo '{}' updated successfully", updated_todo.title),
            }.into()
        }
        Err(e) => {
            eprintln!("Error updating todo: {}", e);
            StatusResponse {
                status: StatusEnum::Error,
                message: format!("Error updating todo '{}': {}", title, e),
            }.into()
        }
    }
}
async fn get_todo_handler(Path(id): Path<i32>) -> Json<TodoWithStatus> {
    // Fetch todos from the database
    let todos = get_todo_by_id(id);
    match todos {
        Ok(todo) => {
            Json(TodoWithStatus {
                status: StatusEnum::Success,
                message: "Todo fetched successfully".to_string(),
                todo: Some(todo),
            })
        }
        Err(e) => {
            eprintln!("Error fetching todo: {}", e);
            Json(TodoWithStatus {
                status: StatusEnum::Error,
                message: format!("Error fetching todo with id {}: {}", id, e),
                todo: None,
            })
        }
        
    }
}

#[tokio::main]
async fn main() {
    let mut connection = establish_connection();
    connection.run_pending_migrations(MIGRATIONS).expect("Failed to run migrations");
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| {
                // axum logs rejections from built-in extractors with the `axum::rejection`
                // target, at `TRACE` level. `axum::rejection=trace` enables showing those events
                format!(
                    "{}=debug,tower_http=debug,axum::rejection=trace",
                    env!("CARGO_CRATE_NAME")
                )
                .into()
            }),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();
    let app = Router::new()
        .route("/api/todos", get(get_todos_handler))
        .route("/api/todo/{id}", get(get_todo_handler))
        .route("/api/todo", post(new_todo))
        .route("/api/todo", put(update_todo_handler))
        .route("/api/todo/{id}", delete(delete_todo_handler))
        .route("/api/clear", delete(delete_todo_by_completed_handler))
        .route("/", get(|| async {static_handler(axum::extract::Path::<String>("index.html".to_string())).await}))
        .route("/{*path}", get(static_handler))
        .layer(TraceLayer::new_for_http()
            .make_span_with(|request: &axum::http::Request<axum::body::Body>| {
                tracing::info_span!(
                    "http_request",
                    method = %request.method(),
                    uri = %request.uri(),
                    version = ?request.version(),
                    headers = ?request.headers(),
                )
            })
        );
    let addr = SocketAddr::from(([127, 0, 0, 1], 8000));
    tracing::debug!("Listening on {}", addr);
    let listener = TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app)
        .await
        .unwrap();
}