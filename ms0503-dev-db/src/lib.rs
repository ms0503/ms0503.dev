#![feature(str_as_str)]

use crate::category::CategoryCreateRequest;
use crate::post::PostCreateRequest;
use crate::tag::TagCreateRequest;
#[cfg(feature = "worker")]
use dotenvy::dotenv;
pub use models::*;
#[cfg(feature = "worker")]
use worker::Context;
#[cfg(feature = "worker")]
use worker::Env;
#[cfg(feature = "worker")]
use worker::Headers;
#[cfg(feature = "worker")]
use worker::Request;
#[cfg(feature = "worker")]
use worker::Response;
#[cfg(feature = "worker")]
use worker::Result;
#[cfg(feature = "worker")]
use worker::RouteContext;
#[cfg(feature = "worker")]
use worker::Router;
#[cfg(feature = "worker")]
use worker::event;

mod models;

#[cfg(feature = "worker")]
#[event(fetch, respond_with_errors)]
async fn main(req: Request, env: Env, _ctx: Context) -> Result<Response> {
    dotenv().ok();
    console_error_panic_hook::set_once();
    with_tag_routes(with_post_routes(with_category_routes(Router::new())))
        .run(req, env)
        .await
}

#[cfg(feature = "worker")]
fn with_category_routes<'a, D: 'a>(router: Router<'a, D>) -> Router<'a, D> {
    with_category_put_routes(with_category_post_routes(with_category_get_routes(
        with_category_delete_routes(router)
    )))
}

#[cfg(feature = "worker")]
fn with_post_routes<'a, D: 'a>(router: Router<'a, D>) -> Router<'a, D> {
    with_post_put_routes(with_post_post_routes(with_post_get_routes(
        with_post_delete_routes(router)
    )))
}

#[cfg(feature = "worker")]
fn with_tag_routes<'a, D: 'a>(router: Router<'a, D>) -> Router<'a, D> {
    with_tag_put_routes(with_tag_post_routes(with_tag_get_routes(
        with_tag_delete_routes(router)
    )))
}

#[cfg(feature = "worker")]
fn with_category_delete_routes<'a, D: 'a>(router: Router<'a, D>) -> Router<'a, D> {
    router.delete_async("/v1/category/:id", |req, ctx| {
        with_check_auth_header(req, ctx, |_, ctx| async move {
            let id = ctx.param("id").unwrap();
            let Ok(mut db) = ctx.env.d1("db") else {
                return Response::error("Failed to connect to database", 500);
            };
            if !category::exists(&mut db, id).await {
                return Response::error("No such category", 404);
            }
            match category::delete(&mut db, id).await {
                Ok(_) => Response::empty(),
                Err(_) => Response::error("Failed to delete category", 500)
            }
        })
    })
}

#[cfg(feature = "worker")]
fn with_category_get_routes<'a, D: 'a>(router: Router<'a, D>) -> Router<'a, D> {
    router
        .get_async("/v1/category", |req, ctx| async move {
            let Ok(mut db) = ctx.env.d1("db") else {
                return Response::error("Failed to connect to database", 500);
            };
            let mut count = 0i64;
            let mut page = 1i64;
            for (k, v) in req.url().unwrap().query_pairs() {
                if let Ok(v) = v.parse::<i64>() {
                    match k.as_str() {
                        "count" => count = v,
                        "page" => page = v,
                        _ => {}
                    }
                }
            }
            match category::get_many(&mut db, count, page).await {
                Ok(cs) => Response::from_json(&cs),
                Err(_) => Response::error("Failed to get categories", 500)
            }
        })
        .get_async("/v1/category/:id", |_, ctx| async move {
            let id = ctx.param("id").unwrap();
            let Ok(mut db) = ctx.env.d1("db") else {
                return Response::error("Failed to connect to database", 500);
            };
            if !category::exists(&mut db, id).await {
                return Response::error("No such category", 404);
            }
            match category::get(&mut db, id).await {
                Ok(c) => Response::from_json(&c),
                Err(_) => Response::error("Failed to get category", 500)
            }
        })
        .get_async("/v1/category/:id/:col", |_, ctx| async move {
            let id = ctx.param("id").unwrap();
            let Ok(mut db) = ctx.env.d1("db") else {
                return Response::error("Failed to connect to database", 500);
            };
            if !category::exists(&mut db, id).await {
                return Response::error("No such category", 404);
            }
            match ctx.param("col").unwrap().as_str() {
                "name" => match category::get_name(&mut db, id).await {
                    Ok(n) => Response::from_json(&n),
                    Err(_) => Response::error("Failed to get name", 500)
                },
                _ => Response::error("Invalid column name", 400)
            }
        })
}

#[cfg(feature = "worker")]
fn with_category_post_routes<'a, D: 'a>(router: Router<'a, D>) -> Router<'a, D> {
    router.post_async("/v1/category", |req, ctx| {
        with_check_auth_header(req, ctx, |mut req, ctx| async move {
            let Ok(body) = req.json::<CategoryCreateRequest>().await else {
                return Response::error("Invalid request", 400);
            };
            let Ok(mut db) = ctx.env.d1("db") else {
                return Response::error("Failed to connect to database", 500);
            };
            match category::create(&mut db, &body.name).await {
                Ok(_) => Response::empty(),
                Err(_) => Response::error("Failed to create category", 500)
            }
        })
    })
}

#[cfg(feature = "worker")]
fn with_category_put_routes<'a, D: 'a>(router: Router<'a, D>) -> Router<'a, D> {
    router.put_async("/v1/category/:id/:col", |req, ctx| {
        with_check_auth_header(req, ctx, |mut req, ctx| async move {
            let id = ctx.param("id").unwrap();
            let Ok(mut db) = ctx.env.d1("db") else {
                return Response::error("Failed to connect to database", 500);
            };
            if !category::exists(&mut db, id).await {
                return Response::error("No such category", 404);
            }
            match ctx.param("col").unwrap().as_str() {
                "name" => {
                    let name = req.text().await.unwrap();
                    if name.len() == 0 {
                        return Response::error("Invalid request", 400);
                    }
                    match category::update_name(&mut db, id, &name).await {
                        Ok(_) => Response::empty(),
                        Err(_) => Response::error("Failed to update category name", 500)
                    }
                }
                _ => Response::error("Invalid column name", 400)
            }
        })
    })
}

#[cfg(feature = "worker")]
fn with_post_delete_routes<'a, D: 'a>(router: Router<'a, D>) -> Router<'a, D> {
    router
        .delete_async("/v1/post/:id", |req, ctx| {
            with_check_auth_header(req, ctx, |_, ctx| async move {
                let id = ctx.param("id").unwrap();
                let Ok(mut db) = ctx.env.d1("db") else {
                    return Response::error("Failed to connect to database", 500);
                };
                if !post::exists(&mut db, id).await {
                    return Response::error("No such post", 404);
                }
                match post::delete(&mut db, id).await {
                    Ok(_) => Response::empty(),
                    Err(_) => Response::error("Failed to delete post", 500)
                }
            })
        })
        .delete_async("/v1/post/:id/tags/:tagId", |req, ctx| {
            with_check_auth_header(req, ctx, |_, ctx| async move {
                let id = ctx.param("id").unwrap();
                let tag_id = ctx.param("tagId").unwrap();
                let Ok(mut db) = ctx.env.d1("db") else {
                    return Response::error("Failed to connect to database", 500);
                };
                if !post::exists(&mut db, id).await {
                    return Response::error("No such post", 404);
                }
                match post_and_tag::delete(&mut db, id, tag_id).await {
                    Ok(_) => Response::empty(),
                    Err(_) => Response::error("Failed to delete tag", 500)
                }
            })
        })
}

#[cfg(feature = "worker")]
fn with_post_get_routes<'a, D: 'a>(router: Router<'a, D>) -> Router<'a, D> {
    router
        .get_async("/v1/post", |req, ctx| async move {
            let Ok(mut db) = ctx.env.d1("db") else {
                return Response::error("Failed to connect to database", 500);
            };
            let mut count = 0i64;
            let mut page = 1i64;
            for (k, v) in req.url().unwrap().query_pairs() {
                if let Ok(v) = v.parse::<i64>() {
                    match k.as_str() {
                        "count" => count = v,
                        "page" => page = v,
                        _ => {}
                    }
                }
            }
            match post::get_many(&mut db, count, page).await {
                Ok(ps) => Response::from_json(&ps),
                Err(_) => Response::error("Failed to get posts", 500)
            }
        })
        .get_async("/v1/post/:id", |_, ctx| async move {
            let id = ctx.param("id").unwrap();
            let Ok(mut db) = ctx.env.d1("db") else {
                return Response::error("Failed to connect to database", 500);
            };
            if !post::exists(&mut db, id).await {
                return Response::error("No such post", 404);
            }
            match post::get(&mut db, id).await {
                Ok(p) => Response::from_json(&p),
                Err(_) => Response::error("Failed to get post", 500)
            }
        })
        .get_async("/v1/post/:id/:col", |_, ctx| async move {
            let id = ctx.param("id").unwrap();
            let Ok(mut db) = ctx.env.d1("db") else {
                return Response::error("Failed to connect to database", 500);
            };
            if !post::exists(&mut db, id).await {
                return Response::error("No such post", 404);
            }
            match ctx.param("col").unwrap().as_str() {
                "body" => match post::get_body(&mut db, id).await {
                    Ok(b) => Response::from_json(&b),
                    Err(_) => Response::error("Failed to get body", 500)
                },
                "category" => match post::get_category(&mut db, id).await {
                    Ok(c) => Response::from_json(&c),
                    Err(_) => Response::error("Failed to get category", 500)
                },
                "category_id" => match post::get_category_id(&mut db, id).await {
                    Ok(c) => Response::from_json(&c),
                    Err(_) => Response::error("Failed to get category id", 500)
                },
                "created_at" => match post::get_created_at(&mut db, id).await {
                    Ok(c) => Response::from_json(&c),
                    Err(_) => Response::error("Failed to get created at", 500)
                },
                "description" => match post::get_description(&mut db, id).await {
                    Ok(d) => Response::from_json(&d),
                    Err(_) => Response::error("Failed to get description", 500)
                },
                "tags" => match post::get_tags(&mut db, id).await {
                    Ok(ts) => Response::from_json(&ts),
                    Err(_) => Response::error("Failed to get tags", 500)
                },
                "title" => match post::get_title(&mut db, id).await {
                    Ok(t) => Response::from_json(&t),
                    Err(_) => Response::error("Failed to get title", 500)
                },
                "updated_at" => match post::get_updated_at(&mut db, id).await {
                    Ok(u) => Response::from_json(&u),
                    Err(_) => Response::error("Failed to get updated at", 500)
                },
                _ => Response::error("Invalid column name", 400)
            }
        })
}

#[cfg(feature = "worker")]
fn with_post_post_routes<'a, D: 'a>(router: Router<'a, D>) -> Router<'a, D> {
    router
        .post_async("/v1/post", |req, ctx| {
            with_check_auth_header(req, ctx, |mut req, ctx| async move {
                let Ok(body) = req.json::<PostCreateRequest>().await else {
                    return Response::error("Invalid request", 400);
                };
                let Ok(mut db) = ctx.env.d1("db") else {
                    return Response::error("Failed to connect to database", 500);
                };
                match post::create(
                    &mut db,
                    &body.title,
                    &body.category_id,
                    &body.body,
                    body.description
                )
                .await
                {
                    Ok(_) => Response::empty(),
                    Err(_) => Response::error("Failed to create post", 500)
                }
            })
        })
        .post_async("/v1/post/:id/tags/:tagId", |req, ctx| {
            with_check_auth_header(req, ctx, |_, ctx| async move {
                let id = ctx.param("id").unwrap();
                let tag_id = ctx.param("tagId").unwrap();
                let Ok(mut db) = ctx.env.d1("db") else {
                    return Response::error("Failed to connect to database", 500);
                };
                if !post::exists(&mut db, id).await {
                    return Response::error("No such post", 404);
                }
                if !tag::exists(&mut db, tag_id).await {
                    return Response::error("No such tag", 404);
                }
                match post_and_tag::create(&mut db, id, tag_id).await {
                    Ok(_) => Response::empty(),
                    Err(_) => Response::error("Failed to add tag", 500)
                }
            })
        })
}

#[cfg(feature = "worker")]
fn with_post_put_routes<'a, D: 'a>(router: Router<'a, D>) -> Router<'a, D> {
    router.put_async("/v1/post/:id/:col", |req, ctx| {
        with_check_auth_header(req, ctx, |mut req, ctx| async move {
            let id = ctx.param("id").unwrap();
            let Ok(mut db) = ctx.env.d1("db") else {
                return Response::error("Failed to connect to database", 500);
            };
            if !post::exists(&mut db, id).await {
                return Response::error("No such post", 404);
            }
            match ctx.param("col").unwrap().as_str() {
                "body" => {
                    let body = req.text().await.unwrap();
                    if body.len() == 0 {
                        return Response::error("Invalid request", 400);
                    }
                    match post::update_body(&mut db, &id, &body).await {
                        Ok(_) => Response::empty(),
                        Err(_) => Response::error("Failed to update body", 500)
                    }
                }
                "category_id" => {
                    let category_id = req.text().await.unwrap();
                    if category_id.len() == 0 {
                        return Response::error("Invalid request", 400);
                    }
                    match post::update_category_id(&mut db, &id, &category_id).await {
                        Ok(_) => Response::empty(),
                        Err(_) => Response::error("Failed to update category id", 500)
                    }
                }
                "description" => {
                    let description = {
                        let description = req.text().await.unwrap();
                        if description.len() == 0 {
                            None
                        } else {
                            Some(description)
                        }
                    };
                    match post::update_description(&mut db, &id, description).await {
                        Ok(_) => Response::empty(),
                        Err(_) => Response::error("Failed to update description", 500)
                    }
                }
                "title" => {
                    let title = req.text().await.unwrap();
                    if title.len() == 0 {
                        return Response::error("Invalid request", 400);
                    }
                    match post::update_title(&mut db, &id, &title).await {
                        Ok(_) => Response::empty(),
                        Err(_) => Response::error("Failed to update title", 500)
                    }
                }
                _ => Response::error("Invalid column name", 400)
            }
        })
    })
}

#[cfg(feature = "worker")]
fn with_tag_delete_routes<'a, D: 'a>(router: Router<'a, D>) -> Router<'a, D> {
    router.delete_async("/v1/tag/:id", |req, ctx| {
        with_check_auth_header(req, ctx, |_, ctx| async move {
            let id = ctx.param("id").unwrap();
            let Ok(mut db) = ctx.env.d1("db") else {
                return Response::error("Failed to connect to database", 500);
            };
            if !tag::exists(&mut db, id).await {
                return Response::error("No such tag", 404);
            }
            match tag::delete(&mut db, id).await {
                Ok(_) => Response::empty(),
                Err(_) => Response::error("Failed to delete tag", 500)
            }
        })
    })
}

#[cfg(feature = "worker")]
fn with_tag_get_routes<'a, D: 'a>(router: Router<'a, D>) -> Router<'a, D> {
    router
        .get_async("/v1/tag", |req, ctx| async move {
            let Ok(mut db) = ctx.env.d1("db") else {
                return Response::error("Failed to connect to database", 500);
            };
            let mut count = 0i64;
            let mut page = 1i64;
            for (k, v) in req.url().unwrap().query_pairs() {
                if let Ok(v) = v.parse::<i64>() {
                    match k.as_str() {
                        "count" => count = v,
                        "page" => page = v,
                        _ => {}
                    }
                }
            }
            match tag::get_many(&mut db, count, page).await {
                Ok(ts) => Response::from_json(&ts),
                Err(_) => Response::error("Failed to get tags", 500)
            }
        })
        .get_async("/v1/tag/:id", |_, ctx| async move {
            let id = ctx.param("id").unwrap();
            let Ok(mut db) = ctx.env.d1("db") else {
                return Response::error("Failed to connect to database", 500);
            };
            if !tag::exists(&mut db, id).await {
                return Response::error("No such tag", 404);
            }
            match tag::get(&mut db, id).await {
                Ok(t) => Response::from_json(&t),
                Err(_) => Response::error("Failed to get tag", 500)
            }
        })
        .get_async("/v1/tag/:id/:col", |_, ctx| async move {
            let id = ctx.param("id").unwrap();
            let Ok(mut db) = ctx.env.d1("db") else {
                return Response::error("Failed to connect to database", 500);
            };
            if !tag::exists(&mut db, id).await {
                return Response::error("No such tag", 404);
            }
            match ctx.param("col").unwrap().as_str() {
                "name" => match tag::get_name(&mut db, id).await {
                    Ok(n) => Response::from_json(&n),
                    Err(_) => Response::error("Failed to get name", 500)
                },
                "posts" => match tag::get_posts(&mut db, id).await {
                    Ok(ps) => Response::from_json(&ps),
                    Err(_) => Response::error("Failed to get posts", 500)
                },
                _ => Response::error("Invalid column name", 400)
            }
        })
}

#[cfg(feature = "worker")]
fn with_tag_post_routes<'a, D: 'a>(router: Router<'a, D>) -> Router<'a, D> {
    router.post_async("/v1/tag", |req, ctx| {
        with_check_auth_header(req, ctx, |mut req, ctx| async move {
            let Ok(body) = req.json::<TagCreateRequest>().await else {
                return Response::error("Invalid request", 400);
            };
            let Ok(mut db) = ctx.env.d1("db") else {
                return Response::error("Failed to connect to database", 500);
            };
            match tag::create(&mut db, &body.name).await {
                Ok(_) => Response::empty(),
                Err(_) => Response::error("Failed to create tag", 500)
            }
        })
    })
}

#[cfg(feature = "worker")]
fn with_tag_put_routes<'a, D: 'a>(router: Router<'a, D>) -> Router<'a, D> {
    router.put_async("/v1/tag/:id/:col", |req, ctx| {
        with_check_auth_header(req, ctx, |mut req, ctx| async move {
            let id = ctx.param("id").unwrap();
            let Ok(mut db) = ctx.env.d1("db") else {
                return Response::error("Failed to connect to database", 500);
            };
            if !tag::exists(&mut db, id).await {
                return Response::error("No such tag", 404);
            }
            match ctx.param("col").unwrap().as_str() {
                "name" => {
                    let name = req.text().await.unwrap();
                    if name.len() == 0 {
                        return Response::error("Invalid request", 400);
                    }
                    match tag::update_name(&mut db, id, &name).await {
                        Ok(_) => Response::empty(),
                        Err(_) => Response::error("Failed to update name", 500)
                    }
                }
                _ => Response::error("Invalid column name", 400)
            }
        })
    })
}

#[cfg(feature = "worker")]
async fn with_check_auth_header<'a, D, T>(
    req: Request,
    ctx: RouteContext<D>,
    cb: impl Fn(Request, RouteContext<D>) -> T + 'a
) -> Result<Response>
where
    T: Future<Output = Result<Response>> + 'a
{
    if !req.headers().has("Authorization")? {
        return Response::error("Token not specified", 401).and_then(|res| {
            Ok(res.with_headers({
                let mut headers = Headers::default();
                headers
                    .set("WWW-Authenticate", "Bearer realm=\"ms0503.dev DB API\"")
                    .ok();
                headers
            }))
        });
    }
    if req.headers().get("Authorization")?.unwrap() != format!("Bearer {}", ctx.var("API_TOKEN")?) {
        return Response::error("Invalid token", 401).and_then(|res| {
            Ok(res.with_headers({
                let mut headers = Headers::default();
                headers
                    .set(
                        "WWW-Authenticate",
                        "Bearer realm=\"ms0503.dev DB API\", error=\"invalid_token\""
                    )
                    .ok();
                headers
            }))
        });
    }
    cb(req, ctx).await
}
