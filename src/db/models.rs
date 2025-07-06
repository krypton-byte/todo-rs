use super::schema::todo;
use diesel::{prelude::{AsChangeset, QueryableByName}, Insertable, Queryable, Selectable};
use serde::{Deserialize, Serialize};

#[derive(Queryable, Selectable, Serialize, Deserialize, QueryableByName)]
#[diesel(table_name = todo)]
pub struct Todo {
    pub id: i32,
    pub title: String,
    pub completed: bool,
}
#[derive(Insertable, Deserialize, AsChangeset)]
#[diesel(table_name = todo)]
pub struct NewTodo {
    pub title: String,
    pub completed: bool,
}
