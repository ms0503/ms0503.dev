use crate::category::Category;
use worker::D1Database;
use worker::Result;

pub async fn exists(db: &mut D1Database, id: &str) -> bool {
    db.prepare("select id from categories where id = ?1")
        .bind(&[id.into()])
        .unwrap()
        .first::<String>(Some("id"))
        .await
        .unwrap()
        .is_some()
}

pub async fn get(db: &mut D1Database, id: &str) -> Result<Category> {
    Ok(db
        .prepare("select * from categories where id = ?1")
        .bind(&[id.into()])?
        .first(None)
        .await?
        .unwrap())
}

pub async fn get_many(db: &mut D1Database, count: i64, page: i64) -> Result<Vec<Category>> {
    db.prepare("select * from categories limit ?1 offset ?2")
        .bind(&[
            count.to_string().into(),
            (count * (page - 1)).to_string().into()
        ])?
        .all()
        .await?
        .results()
}

pub async fn get_name(db: &mut D1Database, id: &str) -> Result<String> {
    Ok(db
        .prepare("select name from categories where id = ?1")
        .bind(&[id.into()])?
        .first(Some("name"))
        .await?
        .unwrap())
}
