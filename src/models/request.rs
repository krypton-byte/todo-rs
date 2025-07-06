use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
pub struct TodoID {
    id: i32,
}
