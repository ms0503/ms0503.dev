use crate::post_and_tag;
use crate::post_and_tag::PostAndTag;
use worker::D1Database;
use worker::Result;

pub async fn create(db: &mut D1Database, post_id: &str, tag_id: &str) -> Result<PostAndTag> {
    db.prepare("insert into posts_and_tags (post_id, tag_id) values (?1, ?2)")
        .bind(&[post_id.into(), tag_id.into()])?
        .run()
        .await?;
    Ok(post_and_tag::get(db, post_id, tag_id).await.unwrap())
}
