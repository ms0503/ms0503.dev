use serde::Deserialize;
use serde::Serialize;

#[derive(Debug, Deserialize, Eq, PartialEq, Serialize)]
pub struct PostBody {
    pub body: String,
    pub id: String
}
