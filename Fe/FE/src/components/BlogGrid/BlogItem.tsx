import Image from 'next/image';
import Link from 'next/link';
import { Blog } from '../../types/blog';

interface BlogItemProps {
  blog: Blog;
}

const BlogItem = ({ blog }: BlogItemProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="blog-item">
      <div className="blog-image">
        <Link href={`/blog/${blog._id}`}>
          <Image
            src={blog.image || '/images/blog-placeholder.jpg'}
            alt={blog.title}
            width={400}
            height={300}
            className="img-fluid"
          />
        </Link>
      </div>
      <div className="blog-content">
        <div className="blog-meta">
          <span className="author">
            <i className="far fa-user"></i> {blog.author.fullName}
          </span>
          <span className="date">
            <i className="far fa-calendar-alt"></i> {formatDate(blog.createdAt)}
          </span>
          <span className="views">
            <i className="far fa-eye"></i> {blog.views} views
          </span>
        </div>
        <h3 className="blog-title">
          <Link href={`/blog/${blog._id}`}>{blog.title}</Link>
        </h3>
        <p className="blog-summary">{blog.summary}</p>
        {blog.tags && blog.tags.length > 0 && (
          <div className="blog-tags">
            {blog.tags.map((tag, index) => (
              <Link key={index} href={`/blog/tag/${tag}`} className="tag">
                {tag}
              </Link>
            ))}
          </div>
        )}
        <Link href={`/blog/${blog._id}`} className="read-more">
          Read More <i className="fas fa-arrow-right"></i>
        </Link>
      </div>
    </div>
  );
};

export default BlogItem; 