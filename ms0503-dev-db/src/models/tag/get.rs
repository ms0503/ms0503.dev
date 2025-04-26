use crate::post::Post;
use crate::post_and_tag::get_posts_by_tag_id;
use crate::tag::Tag;
use worker::D1Database;
use worker::Result;

pub async fn exists(db: &mut D1Database, id: &str) -> bool {
    db.prepare("select id from tags where id = ?1")
        .bind(&[id.into()])
        .unwrap()
        .first::<String>(Some("id"))
        .await
        .unwrap()
        .is_some()
}

pub async fn get(db: &mut D1Database, id: &str) -> Result<Tag> {
    Ok(db
        .prepare("select * from tags where id = ?1")
        .bind(&[id.into()])?
        .first(None)
        .await?
        .unwrap())
}

pub async fn get_many(db: &mut D1Database, count: i64, page: i64) -> Result<Vec<Tag>> {
    db.prepare("select * from tags limit ?1 offset ?2")
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
        .prepare("select name from tags where id = ?1")
        .bind(&[id.into()])?
        .first(Some("name"))
        .await?
        .unwrap())
}

pub async fn get_posts(db: &mut D1Database, id: &str) -> Result<Vec<Post>> {
    get_posts_by_tag_id(db, id).await
}
