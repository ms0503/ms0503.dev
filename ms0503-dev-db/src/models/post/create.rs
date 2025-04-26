use worker::D1Database;
use worker::Result;

pub async fn create(
    db: &mut D1Database,
    title: &str,
    category_id: &str,
    body: &str,
    description: Option<String>
) -> Result<()> {
    db.prepare("insert into posts (category_id, description, id, title) values (?1, ?2, ?3, ?4); insert into post_bodies (body, id) values (?5, ?3)")
        .bind(&[
            category_id.into(),
            description.into(),
            cuid2::create_id().into(),
            title.into(),
            body.into()
        ])?
        .run()
        .await?;
    Ok(())
}
