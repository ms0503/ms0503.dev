#[cfg(feature = "worker")]
pub(crate) use create::*;
#[cfg(feature = "worker")]
pub(crate) use delete::*;
#[cfg(feature = "worker")]
pub(crate) use get::*;
use serde::Deserialize;
use serde::Serialize;

#[cfg(feature = "worker")]
mod create;
#[cfg(feature = "worker")]
mod delete;
#[cfg(feature = "worker")]
mod get;

#[derive(Debug, Deserialize, Eq, PartialEq, Serialize)]
pub struct PostAndTag {
    pub post_id: String,
    pub tag_id: String
}
