use worker::D1Database;
use worker::Result;

pub async fn create(db: &mut D1Database, name: &str) -> Result<String> {
    let id = cuid2::create_id();
    db.prepare("insert into categories (id, name) values (?1, ?2)")
        .bind(&[(&id).into(), name.into()])?
        .run()
        .await?;
    Ok(id)
}
