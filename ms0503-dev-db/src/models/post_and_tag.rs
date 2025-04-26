pub(crate) use create::*;
pub(crate) use delete::*;
pub(crate) use get::*;
use serde::Deserialize;
use serde::Serialize;

mod create;
mod delete;
mod get;

#[derive(Debug, Deserialize, Eq, PartialEq, Serialize)]
pub struct PostAndTag {
    pub post_id: String,
    pub tag_id: String
}
