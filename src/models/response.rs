use serde::{Deserialize, Serialize};
use crate::db::models::Todo;
#[derive(Serialize, Deserialize)]
pub enum StatusEnum {
    #[serde(rename = "success")]
    Success,
    #[serde(rename = "error")]
    Error,
}
#[derive(Serialize)]
pub struct StatusResponse {
    pub status: StatusEnum,
    pub message: String,
}
#[derive(Deserialize, Serialize)]
pub struct TodoWithStatus {
    pub status: StatusEnum,
    pub message: String,
    pub todo: Option<Todo>,
}
