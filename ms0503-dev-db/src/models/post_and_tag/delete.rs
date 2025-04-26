use worker::D1Database;
use worker::Result;

pub async fn delete(db: &mut D1Database, post_id: &str, tag_id: &str) -> Result<()> {
    db.prepare("delete from posts_and_tags where post_id = ?1, tag_id = ?2")
        .bind(&[post_id.into(), tag_id.into()])?
        .run()
        .await?;
    Ok(())
}
