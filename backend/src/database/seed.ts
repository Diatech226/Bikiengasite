import 'dotenv/config';
import * as argon2 from 'argon2';
import mongoose from 'mongoose';
import slugify from 'slugify';
import { ArticleSchema, ArticleStatus } from '../articles/schemas/article.schema';
import { UserSchema, UserRole } from '../auth/schemas/user.schema';
import { CategorySchema } from '../categories/schemas/category.schema';

const categories = ['Méditation & Spiritualité', 'Sécurité Alimentaire', 'Agro-écologie & Zaï', 'Élevage Pastoral', 'Œuvres & Solidarité', 'Jeunesse & Savoir'];
const articles = [
  { slug: 'patience-de-la-graine', title: "La patience de la graine : méditation sur l'effort communautaire", excerpt: "Pourquoi le retour à la terre fortifie l'esprit et rassemble les générations au village.", content: "Dans la solitude de la terre aride, la graine enfouie attend la pluie. À Nagréogo, la terre enseigne aux jeunes la patience, le travail régulier et l'entraide : chaque habitant est une semence, et la communauté trouve dans l'effort partagé sa véritable floraison.", coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA63VErMeLUme3Nfw3ZGtiOj8mrfJCE4BynWpA51V2u_VzuNqyBk0BCEf6na_JeMFzEnV1Vaz_PyWpSaQhi9YsIgnHni4mmDIKKM3PSdV6e3Jvt7V8mkxRhT_wLnsr7Y-OgGVS-a2DNHY3X2rlKYs2CZUw78ZJWkD8OiG2kwNFaEhhjF2x0xhdi1-mWfd5M_J_Jfb-G1GeFbeZKACGZL9CL33ScRa2ivqtbLc_slNrZsuqW-Jui9Lco', imageAlt: "Doyen marchant sous les arbres à Nagréogo", category: 'Méditation & Spiritualité', readingTimeMinutes: 4, featured: true, publishedAt: '2024-10-12' },
  { slug: 'grenier-de-la-solidarite', title: 'Le grenier de la solidarité : éradiquer la faim par le partage', excerpt: 'Comment Nagréogo a mis sur pied une banque de céréales participative autonome.', content: "Le Grenier de la Fraternité constitue un stock commun alimenté par les producteurs. Pendant la soudure, les vivres sont distribués aux ménages fragiles et prêtés sans intérêt aux autres familles. Cette prévoyance partagée protège aujourd'hui Nagréogo et les villages voisins.", coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXbRHCHQfkHmUKkgrGpvNgfOP6k0q7nHy71LTDkRCcOjAcxX9FpEfcVb1BRGm8ryOMl_SHpN1SO9FmqvrIO9KE5CbWgEc-5M5fB8vhouPu02aHXH0tm3r6ojqIfwNCnyFXvkKrUKo2kA5IouH3SaNxIH-e_mghtHLQsfrTop1usXffVZd6oHVHqdH31vjdbXkQdXP8f0YMnXJyVYLGLiw6VP04quL3IEd8vU_y4UbrpdWd4LXadFgj', imageAlt: 'Grains et sacs de céréales du stock solidaire', category: 'Sécurité Alimentaire', readingTimeMinutes: 6, featured: false, publishedAt: '2024-09-28' },
  { slug: 'education-morale-apprentissage', title: 'Éducation morale & apprentissage agropastoral', excerpt: 'Former les bâtisseurs de demain : le modèle éducatif intégré de notre centre rural.', content: "Les enfants de Nagréogo reçoivent une double instruction : les savoirs fondamentaux le matin, puis l'apprentissage pratique au champ et à la ferme l'après-midi. Chacun apprend à cultiver, protéger les arbres et prendre soin des animaux.", coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5f84jlFwoAbR4vs_ZgGOU2rsPFRD7G1M5hUy9IjY4YOQTgR9egtDV1gfnbKZM0whzwueWI24rDhu-o4XBKFWBgKn73QKOINFBOOdJK4YzPbVeqqSdoUhVrCJXGRR5Fa6OjHze_CjqRs7Hsk5DBSqLn14Jd1mS1nMy-UZ6jHXEtQ7HhHd3foWnEl-xEqwfBvw7DPAy6n5yzSeTHWp-wuRJT3FkD92IPaCJKCxjVVU7DcKqw0ysg_Ba', imageAlt: "Jeunes apprenants devant l'école communautaire", category: 'Jeunesse & Savoir', readingTimeMinutes: 3, featured: false, publishedAt: '2024-09-15' },
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
    const { category, featured, publishedAt, ...articleData } = article;
    await Article.updateOne({ slug: article.slug }, { $setOnInsert: { ...articleData, categoryId: categoryIds.get(category), author: 'Cheick Bikienga Seydou', status: ArticleStatus.PUBLISHED, publishedAt: new Date(publishedAt), isFeatured: featured } }, { upsert: true, runValidators: true });
  }
  console.log(`Seed terminé : administrateur ${email}, ${categories.length} catégories, ${articles.length} articles initiaux.`);
}

seed().finally(() => mongoose.disconnect()).catch((error: unknown) => { console.error(error); process.exitCode = 1; });
