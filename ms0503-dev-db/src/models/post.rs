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
pub struct Post {
    #[serde(rename = "categoryId")]
    pub category_id: String,
    #[serde(rename = "createdAt")]
    pub created_at: String,
    pub id: String,
    pub title: String,
    #[serde(rename = "updatedAt")]
    pub updated_at: String
}

#[derive(Debug, Deserialize, Eq, PartialEq, Serialize)]
pub(crate) struct PostInternal {
    pub category_id: String,
    pub created_at: String,
    pub id: String,
    pub title: String,
    pub updated_at: String
}

impl From<PostInternal> for Post {
    fn from(value: PostInternal) -> Self {
        Self {
            category_id: value.category_id,
            created_at: value.created_at,
            id: value.id,
            title: value.title,
            updated_at: value.updated_at
        }
    }
}

#[derive(Debug, Deserialize, Eq, PartialEq, Serialize)]
pub struct PostCreateRequest {
    pub body: String,
    #[serde(rename = "categoryId")]
    pub category_id: String,
    pub title: String
}
