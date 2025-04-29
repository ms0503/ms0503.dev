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
pub struct Tag {
    pub id: String,
    pub name: String
}

#[derive(Debug, Deserialize, Eq, PartialEq, Serialize)]
pub struct TagCreateRequest {
    pub name: String
}
