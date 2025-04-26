use worker::D1Database;
use worker::Result;

pub async fn delete(db: &mut D1Database, id: &str) -> Result<()> {
    db.prepare("delete categories where id = ?1")
        .bind(&[id.into()])?
        .run()
        .await?;
    Ok(())
}
