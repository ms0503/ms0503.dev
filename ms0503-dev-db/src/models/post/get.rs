use crate::category::Category;
use crate::post::Post;
use crate::post::PostInternal;
use crate::post_and_tag::get_tags_by_post_id;
use crate::tag::Tag;
use worker::D1Database;
use worker::Result;

pub async fn exists(db: &mut D1Database, id: &str) -> bool {
    db.prepare("select id from posts where id = ?1")
        .bind(&[id.into()])
        .unwrap()
        .first::<String>(Some("id"))
        .await
        .unwrap()
        .is_some()
}

pub async fn get(db: &mut D1Database, id: &str) -> Result<Post> {
    Ok(db
        .prepare("select * from posts where id = ?1")
        .bind(&[id.into()])?
        .first::<PostInternal>(None)
        .await?
        .unwrap()
        .into())
}

pub async fn get_body(db: &mut D1Database, id: &str) -> Result<String> {
    Ok(db
        .prepare("select body from post_bodies where id = ?1")
        .bind(&[id.into()])?
        .first(Some("body"))
        .await?
        .unwrap())
}

pub async fn get_category(db: &mut D1Database, id: &str) -> Result<Category> {
    Ok(db
        .prepare("select categories.* from posts inner join categories on posts.category_id = categories.id where posts.id = ?1")
        .bind(&[id.into()])?
        .first(None)
        .await?
        .unwrap())
}

pub async fn get_category_id(db: &mut D1Database, id: &str) -> Result<String> {
    Ok(db
        .prepare("select category_id from posts where id = ?1")
        .bind(&[id.into()])?
        .first(Some("category_id"))
        .await?
        .unwrap())
}

pub async fn get_created_at(db: &mut D1Database, id: &str) -> Result<String> {
    Ok(db
        .prepare("select created_at from posts where id = ?1")
        .bind(&[id.into()])?
        .first(Some("created_at"))
        .await?
        .unwrap())
}

pub async fn get_description(db: &mut D1Database, id: &str) -> Result<String> {
    Ok(db
        .prepare("select description from posts where id = ?1")
        .bind(&[id.into()])?
        .first(Some("description"))
        .await?
        .unwrap())
}

pub async fn get_many(db: &mut D1Database, count: i64, page: i64) -> Result<Vec<Post>> {
    db.prepare("select * from posts limit ?1 offset ?2")
        .bind(&[
            count.to_string().into(),
            (count * (page - 1)).to_string().into()
        ])?
        .all()
        .await?
        .results::<PostInternal>()
        .map(|results| results.into_iter().map(|result| result.into()).collect())
}

pub async fn get_tags(db: &mut D1Database, id: &str) -> Result<Vec<Tag>> {
    get_tags_by_post_id(db, id).await
}

pub async fn get_title(db: &mut D1Database, id: &str) -> Result<String> {
    Ok(db
        .prepare("select title from posts where id = ?1")
        .bind(&[id.into()])?
        .first(Some("title"))
        .await?
        .unwrap())
}

pub async fn get_updated_at(db: &mut D1Database, id: &str) -> Result<String> {
    Ok(db
        .prepare("select updated_at from posts where id = ?1")
        .bind(&[id.into()])?
        .first(Some("updated_at"))
        .await?
        .unwrap())
}
