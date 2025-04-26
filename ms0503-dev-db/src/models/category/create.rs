use worker::D1Database;
use worker::Result;

pub async fn create(db: &mut D1Database, name: &str) -> Result<()> {
    db.prepare("insert into categories (id, name) values (?1, ?2)")
        .bind(&[cuid2::create_id().into(), name.into()])?
        .run()
        .await?;
    Ok(())
}
