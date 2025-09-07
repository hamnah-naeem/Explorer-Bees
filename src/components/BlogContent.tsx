import React from "react";
import BlogSidebar from "./BlogSidebar";
import CommentsSection from "./CommentsSection";
import {
  FaUser,
  FaCalendarAlt,
  FaCommentDots,
  FaShareAlt,
  FaHeart,
  FaPinterest,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import type { Blog } from "../types/Blog";

interface BlogContentProps {
  blog: Blog;
  allBlogs: Blog[];
}

const BlogContent: React.FC<BlogContentProps> = ({ blog, allBlogs }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Left Content */}
        <div className="lg:col-span-3">
          {/* Blog Meta Info */}
          <div className="flex items-center gap-4 mb-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FaUser className="text-gray-600" />
              <span>{blog.readTime} read</span>
            </div>

            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-gray-600" />
              <span>{blog.date}</span>
            </div>

            {blog.location && (
              <div className="flex items-center gap-2">
                <FaCommentDots className="text-gray-600" />
                <span>{blog.location}</span>
              </div>
            )}
          </div>

          {/* Social Share Icons */}
          <div className="flex items-center justify-end gap-4 mb-8">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-600 hover:text-yellow-600 transition"
            >
              <FaShareAlt className="w-5 h-5" />
            </a>

            <button className="p-2 text-gray-600 hover:text-yellow-600 transition">
              <FaHeart className="w-5 h-5" />
            </button>

            <a
              href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${blog.title}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-600 hover:text-yellow-600 transition"
            >
              <FaXTwitter className="w-5 h-5" />
            </a>

            <a
              href={`https://pinterest.com/pin/create/button/?url=${window.location.href}&media=${blog.image}&description=${blog.title}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-600 hover:text-yellow-600 transition"
            >
              <FaPinterest className="w-5 h-5" />
            </a>
          </div>

          {/* Main Article Content */}
          <article className="prose prose-lg max-w-none mb-16">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-black">
                {blog.title}
              </h2>
              <p className="text-sm text-yellow-600 mb-6">— {blog.category}</p>
            </div>

            {/* Featured Image */}
            <div className="mb-8">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-80 object-cover rounded-lg shadow-lg"
              />
            </div>

            {/* Post Details Section */}
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-bold mb-4 text-black">
                Post Details
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Posted on:</span>
                  <span>{blog.date}</span>
                  <span className="ml-4 font-medium">Author:</span>
                  <span className="text-yellow-600">{blog.author}</span>
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="space-y-6">
              {blog.content?.map((para, index) => (
                <p key={index} className="text-gray-700 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </article>

          <CommentsSection />
        </div>

        {/* Right Sidebar */}
        <BlogSidebar blog={blog} allBlogs={allBlogs} />
      </div>
    </div>
  );
};

export default BlogContent;
