use worker::D1Database;
use worker::Result;

pub async fn update_body(db: &mut D1Database, id: &str, body: &str) -> Result<()> {
    db.prepare("update post_bodies set body = ?1 where id = ?2")
        .bind(&[body.into(), id.into()])?
        .run()
        .await?;
    Ok(())
}

pub async fn update_category_id(db: &mut D1Database, id: &str, category_id: &str) -> Result<()> {
    db.prepare("update posts set category_id = ?1 where id = ?2")
        .bind(&[category_id.into(), id.into()])?
        .run()
        .await?;
    Ok(())
}

pub async fn update_description(
    db: &mut D1Database,
    id: &str,
    description: Option<String>
) -> Result<()> {
    db.prepare("update posts set description = ?1 where id = ?2")
        .bind(&[description.into(), id.into()])?
        .run()
        .await?;
    Ok(())
}

pub async fn update_title(db: &mut D1Database, id: &str, title: &str) -> Result<()> {
    db.prepare("update posts set title = ?1 where id = ?2")
        .bind(&[title.into(), id.into()])?
        .run()
        .await?;
    Ok(())
}
