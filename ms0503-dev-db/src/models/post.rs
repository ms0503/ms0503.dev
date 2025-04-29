#[cfg(feature = "worker")]
pub(crate) use create::*;
#[cfg(feature = "worker")]
pub(crate) use delete::*;
#[cfg(feature = "worker")]
pub(crate) use get::*;
use serde::Deserialize;
use serde::Serialize;
#[cfg(feature = "worker")]
pub(crate) use update::*;

#[cfg(feature = "worker")]
mod create;
#[cfg(feature = "worker")]
mod delete;
#[cfg(feature = "worker")]
mod get;
#[cfg(feature = "worker")]
mod update;

#[derive(Debug, Deserialize, Eq, PartialEq, Serialize)]
pub struct Post {
    #[serde(rename = "categoryId")]
    pub category_id: String,
    #[serde(rename = "createdAt")]
    pub created_at: String,
    pub description: Option<String>,
    pub id: String,
    pub title: String,
    #[serde(rename = "updatedAt")]
    pub updated_at: String
}

#[derive(Debug, Deserialize, Eq, PartialEq, Serialize)]
pub(crate) struct PostInternal {
    pub category_id: String,
    pub created_at: String,
    pub description: Option<String>,
    pub id: String,
    pub title: String,
    pub updated_at: String
}

impl From<PostInternal> for Post {
    fn from(value: PostInternal) -> Self {
        Self {
            category_id: value.category_id,
            created_at: value.created_at,
            description: value.description,
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
    pub description: Option<String>,
    pub title: String
}
