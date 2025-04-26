use crate::post::Post;
use crate::post::get;
use worker::D1Database;
use worker::Result;

pub async fn create(
    db: &mut D1Database,
    title: &str,
    category_id: &str,
    body: &str
) -> Result<Post> {
    let id = cuid2::create_id();
    db.prepare("insert into posts (category_id, id, title) values (?1, ?2, ?3); insert into post_bodies (body, id) values (?4, ?2)")
        .bind(&[
            category_id.into(),
            (&id).into(),
            title.into(),
            body.into()
        ])?
        .run()
        .await?;
    Ok(get(db, &id).await.unwrap())
}
