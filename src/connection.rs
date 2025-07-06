use diesel::prelude::*;
use dotenv::dotenv;
use std::env;

use crate::db::models::*;
use crate::db::schema::todo::dsl::{completed, todo};
use crate::db::schema::todo::id;
use diesel_migrations::{embed_migrations, EmbeddedMigrations};

// This will embed the migrations from the "migrations" directory
pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!("migrations");

pub fn establish_connection() -> SqliteConnection {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").unwrap_or_else(|_| {
        "sqlite://todo.db".to_string()
    });
    SqliteConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}
pub fn get_todos() -> Vec<Todo> {
    let connection = &mut establish_connection();
    todo.select(Todo::as_select()).load(connection).expect("Error loading posts")
}

pub fn get_todo_by_id(todo_id: i32) -> QueryResult<Todo> {
    let connection = &mut establish_connection();
    todo.select(Todo::as_select()).find(todo_id).first(connection)
}
pub fn create_todo(new_todo: &NewTodo) -> QueryResult<Todo> {
    let connection = &mut establish_connection();
    match diesel::insert_into(todo)
        .values(new_todo)
        .execute(connection){
        Ok(_) => {
            todo.select(Todo::as_select()).order(id.desc()).first::<Todo>(connection)

        },
        Err(_) => {
            Err(diesel::result::Error::RollbackTransaction)
        }
    }
}

pub fn set_completed(todo_id: i32, completed_id: bool) -> QueryResult<usize> {
    let connection = &mut establish_connection();
    diesel::update(todo.find(todo_id.clone()))
        .set(completed.eq(completed_id))
        .execute(connection)
}

pub fn update_todo(todo_id: i32, new_todo: NewTodo) -> QueryResult<Todo> {
    let connection = &mut establish_connection();
    diesel::update(todo.find(todo_id))
        .set(new_todo)
        .execute(connection)?;
    todo.select(Todo::as_select()).find(todo_id).first(connection)
}

pub fn delete_todo(todo_id: i32) -> QueryResult<usize> {
    let connection = &mut establish_connection();
    diesel::delete(todo.find(todo_id)).execute(connection)
}

pub fn clear_todos_by_completed(completed_id: bool) -> QueryResult<usize> {
    let connection = &mut establish_connection();
    diesel::delete(todo.filter(completed.eq(completed_id))).execute(connection)
}