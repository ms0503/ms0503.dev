pub(crate) use create::*;
pub(crate) use delete::*;
pub(crate) use get::*;
use serde::Deserialize;
use serde::Serialize;
pub(crate) use update::*;

mod create;
mod delete;
mod get;
mod update;

#[derive(Debug, Deserialize, Eq, PartialEq, Serialize)]
pub struct Tag {
    pub id: String,
    pub name: String
}

#[derive(Debug, Deserialize, Eq, PartialEq, Serialize)]
pub struct TagCreateRequest {
    pub name: String
}
