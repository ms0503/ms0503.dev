use worker::D1Database;
use worker::Result;

pub async fn update_name(db: &mut D1Database, id: &str, name: &str) -> Result<()> {
    db.prepare("update categories set name = ?1 where id = ?2")
        .bind(&[name.into(), id.into()])?
        .run()
        .await?;
    Ok(())
}
