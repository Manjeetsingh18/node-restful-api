import Article from '../models/articles';
import config from '../../../config/env';
import error from '../../helpers/mongoose-error';
import { isAllowed } from '../../helpers/authorization';

/**
 * Load article by Id.
 */
const loadArticleById = (req, res, next, id) => {
  Article.get(id)
    .then(article => {
      req.article = article;
      return next()
    }).catch(e => res.status(401).json(e));
};

/**
 * create article
 * @return {Article}
 */
const createArticle = (req, res, next) => {
  req.body.author = req.user._id;
  const article = new Article(req.body);
  article.save()
    .then(response => res.json(response))
    .catch(e => res.status(422).json(error(e)));
}

/**
 * get existing article
 * @return {Article}
 */
const getArticle = (req, res, next) => res.json(req.article);

/**
 * Update existing article
 * @return {Article}
 */
const updateArticle = (req, res, next) => {
  if (!isAllowed(req.user, req.article)) return res.status(401).json({ message: 'Forbidden!' });

  let article = req.body;
  article.updated = Date.now();
  article = Object.assign(req.article, article);
  article.save()
    .then(response => res.json(response))
    .catch(e => res.status(422).json(error(e)));
}

/**
 * Delete article.
 * @return {Article}
 */
const removeArticle = (req, res, next) => {
  if (!isAllowed(req.user, req.article)) return res.status(401).json({ message: 'Forbidden!' });
 
  let article = { status: 'VOID' };
  article.updated = Date.now();
  article = Object.assign(req.article, article);
  
  article.save()
    .then(deletedArticle => res.json(deletedArticle))
    .catch(e => res.status(422).json(error(e)));
};

/**
 * Get article list.
 * @return {Article[]}
 */
const listArticles = (req, res, next) => {
  const query = req.query;
  query.status = 'APPROVED';

  Article.list(query)
    .then(articles => res.json(articles))
    .catch(e => res.status(422).json(error(e)));
}

export default { loadArticleById, createArticle, getArticle, listArticles, updateArticle, removeArticle };
