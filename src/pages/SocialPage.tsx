import { useState, useRef, useEffect } from "react";
import {
  HiHome,
  HiMail,
  HiBookmark,
  HiDotsCircleHorizontal,
  HiOutlinePhotograph,
} from "react-icons/hi";
import { FaSearch } from "react-icons/fa";
import logo from "../assets/images/home/logo.png";
import twitterdp from "../assets/images/social/twitter-dp.jpg";
import { trendingItems, followSuggestions } from "../dummy-data/social";
import Post from "../components/Post";
import PostBox from "../components/PostBox";
import { endpoints } from "../apis/endpoints";
import type { PostType, NewPostData } from "../types/Social";

export default function Social() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [newPost, setNewPost] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePost = (postData: NewPostData) => {
    const { content, image, poll } = postData;

    if (
      content.trim() ||
      image ||
      (poll && poll.options.some((opt) => opt.trim()))
    ) {
      const newPost: PostType = {
        id: Date.now(),
        name: "Explorer Bees",
        username: "explorer_bees",
        description: content,
        time: "Just now",
        total_likes: 0,
        total_reposts: 0,
        total_comments: 0,
        image: image || undefined,
        poll: poll
          ? {
              options: poll.options,
              votes: poll.options.map(() => 0),
              totalVotes: 0,
            }
          : undefined,
        user_image: logo,
        repliesList: [],
        fileInputRef: fileInputRef, 
      };

      setPosts([newPost, ...posts]);
      setNewPost("");
      setSelectedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleReply = (postId: number) => {
    if (replyContent.trim()) {
      const updatedPosts = posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              total_comments: post.total_comments + 1,
              repliesList: [
                {
                  id: Date.now(),
                  name: "Explorer Bees",
                  handle: "explorer_bees",
                  content: replyContent,
                  time: "Just now",
                },
                ...(post.repliesList || []),
              ],
            }
          : post
      );
      setPosts(updatedPosts);
      setReplyContent("");
      setReplyingTo(null);
    }
  };

  const SidenavLink = ({
    Icon,
    text,
    active = false,
    compact = false,
    ...props
  }: {
    Icon: React.ComponentType<{ className?: string }>;
    text?: string;
    active?: boolean;
    compact?: boolean;
    [key: string]: any;
  }) => (
    <div
      className={`flex items-center ${
        compact ? "p-2" : "p-3"
      } hover:bg-gray-100 rounded-full cursor-pointer ${
        active ? "font-bold text-yellow-600" : "text-black"
      }`}
      {...props}
    >
      <Icon className={compact ? "h-5 w-5" : "h-6 w-6"} />
      {text && (
        <span className={compact ? "text-sm ml-3" : "text-lg ml-4"}>
          {text}
        </span>
      )}
    </div>
  );

  const TrendingItem = ({ category, title, count }: any) => (
    <div className="py-2 hover:bg-gray-100 px-2 rounded-lg cursor-pointer">
      <div className="text-xs text-gray-500">{category}</div>
      <div className="font-medium text-sm text-black">{title}</div>
      <div className="text-xs text-gray-500">{count}</div>
    </div>
  );

  const FollowSuggestion = ({ name, handle, avatar }: any) => (
    <div className="flex items-center justify-between py-2 hover:bg-gray-100 px-2 rounded-lg cursor-pointer">
      <div className="flex items-center">
        <img
          className="rounded-full w-10 h-10 mr-2"
          src={avatar}
          alt="Avatar"
        />
        <div>
          <div className="font-medium text-sm text-black">{name}</div>
          <div className="text-gray-500 text-sm">@{handle}</div>
        </div>
      </div>
      <button className="bg-yellow-600 text-white font-bold px-3 py-1 rounded-full text-xs hover:bg-yellow-700">
        Follow
      </button>
    </div>
  );

  const fetchTimeline = async () => {
    const formdata = new FormData();
    formdata.append("user_email", "alina@gmail.com");
    formdata.append("limit", "10");
    formdata.append("postOffset", "0");
    formdata.append("hiveOffset", "0");
    formdata.append("sponsoredPostOffset", "0");
    formdata.append("suggestedPostOffset", "0");

    try {
      const response = await fetch(endpoints.getTimeline, {
        method: "POST",
        body: formdata,
      });
      const res = await response.json();
      if (res.error) {
        console.error("Error Message:", res.error_msg);
      } else {
        setPosts(res.records.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, []);

  return (
    <div className="bg-white text-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Sidebar */}
          <div className="lg:col-span-2 xl:col-span-3 px-2 sticky top-0 h-screen hidden md:flex flex-col justify-between py-2">
            <div className="flex flex-col">
              <SidenavLink active Icon={HiHome} text="Home" />
              <SidenavLink Icon={FaSearch} text="Explore" />
              <SidenavLink Icon={HiMail} text="Messages" />
              <SidenavLink Icon={HiBookmark} text="Bookmarks" />
              <SidenavLink Icon={HiDotsCircleHorizontal} text="More" />

              <button
                onClick={() =>
                  handlePost({ content: newPost, image: selectedImage })
                }
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-3 rounded-full text-md mt-2 mx-0"
              >
                Share
              </button>
            </div>

            <div className="mb-4 p-3 hover:bg-gray-100 rounded-full cursor-pointer flex items-center">
              <img className="rounded-full w-10 h-10" src={logo} alt="Avatar" />
              <div className="ml-3">
                <div className="font-bold text-black">Explorer Bees</div>
                <div className="text-gray-500">@explorer_bees</div>
              </div>
            </div>
          </div>

          {/* Feed */}
          <div className="lg:col-span-7 xl:col-span-6 h-screen overflow-y-auto border-x border-gray-200">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white bg-opacity-90 backdrop-blur-sm z-10">
              <div className="text-2xl font-bold text-black">Social Feed</div>
            </div>

            <PostBox
              value={newPost}
              onChange={setNewPost}
              onPost={handlePost}
              selectedImage={selectedImage}
              onImageUpload={handleImageUpload}
              removeImage={removeImage}
              fileInputRef={fileInputRef}
              avatar={logo}
            />

            <div className="pb-16 md:pb-0">
              {posts.map((post) => (
                <div key={post.id}>
                  <Post {...post} onReply={() => setReplyingTo(post.id)} />

                  {replyingTo === post.id && (
                    <div className="pl-16 pr-4 pb-4 bg-gray-50">
                      <div className="border-t border-gray-200 pt-3">
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          className="w-full bg-transparent text-black text-base outline-none resize-none placeholder-gray-500"
                          placeholder="Post your reply"
                          rows={2}
                        />
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex space-x-4 text-yellow-600">
                            <button
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <HiOutlinePhotograph className="h-5 w-5" />
                            </button>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setReplyingTo(null)}
                              className="px-4 py-1 rounded-full border border-gray-300 hover:bg-gray-100 text-black"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleReply(post.id)}
                              disabled={!replyContent.trim()}
                              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold px-4 py-1 rounded-full disabled:opacity-50"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 hidden lg:block sticky top-0 h-screen overflow-y-auto py-4 pl-4 pr-2">
            <div className="bg-gray-100 rounded-full flex items-center px-4 py-2 mb-4">
              <FaSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent border-none outline-none text-black w-full"
              />
            </div>

            <div className="bg-gray-100 rounded-2xl p-4 mb-4">
              <h2 className="text-lg font-bold mb-3 text-black">
                Trending Now
              </h2>
              {trendingItems.map((item, index) => (
                <TrendingItem key={index} {...item} />
              ))}
              <button className="text-yellow-600 hover:text-yellow-700 mt-2 text-sm">
                Show more
              </button>
            </div>

            <div className="bg-gray-100 rounded-2xl p-4">
              <h2 className="text-lg font-bold mb-3 text-black">
                Who to follow
              </h2>
              {followSuggestions.map((suggestion, index) => (
                <FollowSuggestion
                  key={index}
                  {...suggestion}
                  avatar={twitterdp}
                />
              ))}
              <button className="text-yellow-600 hover:text-yellow-700 mt-2 text-sm">
                Show more
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
