import 'dotenv/config';
import * as argon2 from 'argon2';
import mongoose from 'mongoose';
import slugify from 'slugify';
import { ArticleSchema, ArticleStatus } from '../articles/schemas/article.schema';
import { UserSchema, UserRole } from '../auth/schemas/user.schema';
import { CategorySchema } from '../categories/schemas/category.schema';

const categories = ['Méditation & Spiritualité', 'Sécurité Alimentaire', 'Agro-écologie & Zaï', 'Élevage Pastoral', 'Œuvres & Solidarité', 'Jeunesse & Savoir'];
const articles = [
  { title: 'La terre, un dépôt sacré entre nos mains', excerpt: 'Une invitation à cultiver avec responsabilité et patience.', content: 'Prendre soin de la terre, c’est préserver la dignité des familles et préparer l’avenir des enfants. À Nagréogo, cette conviction guide les pratiques agricoles et la transmission des savoirs.', coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef', imageAlt: 'Terres agricoles verdoyantes', category: 'Méditation & Spiritualité' },
  { title: 'Le Zaï, une technique au service des récoltes', excerpt: 'Comment restaurer les sols sahéliens avec une méthode éprouvée.', content: 'Les cuvettes de Zaï concentrent l’eau et la matière organique. Cette technique locale restaure progressivement les terres dégradées et améliore la résilience des cultures.', coverImage: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399', imageAlt: 'Agriculteur travaillant la terre', category: 'Agro-écologie & Zaï' },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!uri) throw new Error('MONGODB_URI est requis');
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !password || password.length < 8) throw new Error('ADMIN_EMAIL valide et ADMIN_PASSWORD (8 caractères minimum) sont requis');
  await mongoose.connect(uri);
  const User = mongoose.model('User', UserSchema);
  const Category = mongoose.model('Category', CategorySchema);
  const Article = mongoose.model('Article', ArticleSchema);
  const passwordHash = await argon2.hash(password);
  await User.updateOne({ email }, { $set: { email, passwordHash, firstName: process.env.ADMIN_FIRST_NAME, lastName: process.env.ADMIN_LAST_NAME, role: UserRole.ADMIN, isActive: true } }, { upsert: true, runValidators: true });
  const categoryIds = new Map<string, mongoose.Types.ObjectId>();
  for (const name of categories) {
    const slug = slugify(name, { lower: true, strict: true, locale: 'fr' });
    const category = await Category.findOneAndUpdate({ slug }, { $set: { name, slug } }, { upsert: true, new: true, runValidators: true });
    categoryIds.set(name, category._id);
  }
  for (const article of articles) {
    const { category, ...articleData } = article;
    const slug = slugify(article.title, { lower: true, strict: true, locale: 'fr' });
    await Article.updateOne({ slug }, { $setOnInsert: { ...articleData, slug, categoryId: categoryIds.get(category), author: 'Cheick Bikienga Seydou', readingTimeMinutes: 3, status: ArticleStatus.PUBLISHED, publishedAt: new Date(), isFeatured: slug.includes('terre') } }, { upsert: true, runValidators: true });
  }
  console.log(`Seed terminé : administrateur ${email}, ${categories.length} catégories, ${articles.length} articles initiaux.`);
}

seed().finally(() => mongoose.disconnect()).catch((error: unknown) => { console.error(error); process.exitCode = 1; });
