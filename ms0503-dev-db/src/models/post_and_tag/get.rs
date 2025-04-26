use crate::post::Post;
use crate::post::PostInternal;
use crate::tag::Tag;
use worker::D1Database;
use worker::Result;

pub async fn get_posts_by_tag_id(db: &mut D1Database, id: &str) -> Result<Vec<Post>> {
    db
        .prepare("select posts.* from posts inner join (posts_and_tags inner join tags on posts_and_tags.tag_id = tags.id) on posts.id = posts_and_tags.post_id where tags.id = ?1")
        .bind(&[id.into()])?
        .all()
        .await?
        .results::<PostInternal>()
        .map(|results| results.into_iter().map(|result| result.into()).collect())
}

pub async fn get_tags_by_post_id(db: &mut D1Database, id: &str) -> Result<Vec<Tag>> {
    db
        .prepare("select tags.* from posts inner join (posts_and_tags inner join tags on posts_and_tags.tag_id = tags.id) on posts.id = posts_and_tags.post_id where posts.id = ?1")
        .bind(&[id.into()])?
        .all()
        .await?
        .results()
}
