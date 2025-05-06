use worker::D1Database;
use worker::Result;

pub async fn create(
    db: &mut D1Database,
    title: &str,
    category_id: &str,
    body: &str,
    description: Option<String>
) -> Result<String> {
    let id = cuid2::create_id();
    db.prepare("insert into posts (category_id, description, id, title) values (?1, ?2, ?3, ?4); insert into post_bodies (body, id) values (?5, ?3)")
        .bind(&[
            category_id.into(),
            description.into(),
            (&id).into(),
            title.into(),
            body.into()
        ])?
        .run()
        .await?;
    Ok(id)
}
