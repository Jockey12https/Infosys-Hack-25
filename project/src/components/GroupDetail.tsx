import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Users, MessageCircle, Heart, Plus, Send, Image, MapPin, Calendar, MoreHorizontal, Pin, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, CommunityGroup, GroupPost, PostComment, GroupMember } from '../lib/supabase';

const GroupDetail = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [group, setGroup] = useState<CommunityGroup | null>(null);
  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    post_type: 'text' as 'text' | 'photo' | 'experience' | 'question' | 'tip',
    location: '',
  });

  const { user } = useAuth();

  useEffect(() => {
    if (groupId) {
      fetchGroupData();
    }
  }, [groupId]);

  const fetchGroupData = async () => {
    try {
      // Fetch group details
      const { data: groupData, error: groupError } = await supabase
        .from('community_groups')
        .select(`
          *,
          profiles:created_by (
            full_name,
            avatar_url
          )
        `)
        .eq('id', groupId)
        .single();

      if (groupError) throw groupError;

      // Check if user is a member
      if (user) {
        const { data: membershipData } = await supabase
          .from('group_members')
          .select('role')
          .eq('group_id', groupId)
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single();

        setGroup({
          ...groupData,
          is_member: !!membershipData,
          user_role: membershipData?.role,
        });
      } else {
        setGroup(groupData);
      }

      // Fetch posts
      await fetchPosts();
      
      // Fetch members
      await fetchMembers();

    } catch (error) {
      console.error('Error fetching group data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('group_posts')
        .select(`
          *,
          profiles:author_id (
            full_name,
            avatar_url
          )
        `)
        .eq('group_id', groupId)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Check if user has liked posts
      if (user && data) {
        const postIds = data.map(post => post.id);
        const { data: likesData } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', user.id)
          .in('post_id', postIds);

        const likedPostIds = new Set(likesData?.map(like => like.post_id) || []);

        const postsWithLikes = data.map(post => ({
          ...post,
          user_liked: likedPostIds.has(post.id),
        }));

        setPosts(postsWithLikes);
      } else {
        setPosts(data || []);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .eq('group_id', groupId)
        .eq('is_active', true)
        .order('joined_at', { ascending: true });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !group?.is_member) return;

    try {
      const { error } = await supabase
        .from('group_posts')
        .insert([{
          group_id: groupId,
          author_id: user.id,
          title: newPost.title || null,
          content: newPost.content,
          post_type: newPost.post_type,
          location: newPost.location || null,
        }]);

      if (error) throw error;

      setNewPost({ title: '', content: '', post_type: 'text', location: '' });
      setShowCreatePost(false);
      await fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) return;

    try {
      const { data: existingLike } = await supabase
        .from('post_likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('post_id', postId)
        .single();

      if (existingLike) {
        // Unlike
        await supabase
          .from('post_likes')
          .delete()
          .eq('id', existingLike.id);
      } else {
        // Like
        await supabase
          .from('post_likes')
          .insert([{
            user_id: user.id,
            post_id: postId,
          }]);
      }

      await fetchPosts();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const joinGroup = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('group_members')
        .insert([{
          group_id: groupId,
          user_id: user.id,
          role: 'member',
        }]);

      if (error) throw error;
      await fetchGroupData();
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'experience': return 'bg-green-100 text-green-800';
      case 'question': return 'bg-blue-100 text-blue-800';
      case 'tip': return 'bg-yellow-100 text-yellow-800';
      case 'photo': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading group...</p>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Group Not Found</h2>
        <p className="text-gray-600">The group you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Group Header */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="relative h-64">
              <img
                src={group.cover_image || 'https://images.pexels.com/photos/1181472/pexels-photo-1181472.jpeg?auto=compress&cs=tinysrgb&w=800'}
                alt={group.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h1 className="text-3xl font-bold mb-2">{group.name}</h1>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {group.member_count} members
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {group.post_count} posts
                  </div>
                  {group.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {group.location}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600 leading-relaxed">{group.description}</p>
                {user && !group.is_member && (
                  <button
                    onClick={joinGroup}
                    className="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition-colors"
                  >
                    Join Group
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Create Post */}
          {user && group.is_member && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              {!showCreatePost ? (
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="w-full text-left p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-300 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={user?.user_metadata?.avatar_url || 'https://images.pexels.com/photos/1181472/pexels-photo-1181472.jpeg?auto=compress&cs=tinysrgb&w=100'}
                      alt="You"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="text-gray-600">Share something with the group...</span>
                  </div>
                </button>
              ) : (
                <form onSubmit={createPost} className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <select
                      value={newPost.post_type}
                      onChange={(e) => setNewPost({ ...newPost, post_type: e.target.value as any })}
                      className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="text">General Post</option>
                      <option value="experience">Share Experience</option>
                      <option value="question">Ask Question</option>
                      <option value="tip">Travel Tip</option>
                      <option value="photo">Photo Share</option>
                    </select>
                  </div>

                  {newPost.post_type !== 'text' && (
                    <input
                      type="text"
                      placeholder="Post title..."
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  )}

                  <textarea
                    placeholder="What's on your mind?"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />

                  <input
                    type="text"
                    placeholder="Location (optional)"
                    value={newPost.location}
                    onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowCreatePost(false)}
                      className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-orange-600 text-white px-6 py-2 rounded-xl hover:bg-orange-700 transition-colors flex items-center"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Post
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Posts */}
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={post.profiles?.avatar_url || 'https://images.pexels.com/photos/1181472/pexels-photo-1181472.jpeg?auto=compress&cs=tinysrgb&w=100'}
                    alt={post.profiles?.full_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-900">
                          {post.profiles?.full_name}
                        </h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPostTypeColor(post.post_type)}`}>
                          {post.post_type.replace('_', ' ')}
                        </span>
                        {post.is_pinned && (
                          <Pin className="h-4 w-4 text-orange-600" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </div>
                    </div>

                    {post.title && (
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h4>
                    )}

                    <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>

                    {post.location && (
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <MapPin className="h-4 w-4 mr-1" />
                        {post.location}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-6">
                        <button
                          onClick={() => toggleLike(post.id)}
                          className={`flex items-center space-x-2 transition-colors ${
                            post.user_liked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                          }`}
                        >
                          <Heart className={`h-5 w-5 ${post.user_liked ? 'fill-current' : ''}`} />
                          <span>{post.like_count}</span>
                        </button>
                        
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                          <MessageCircle className="h-5 w-5" />
                          <span>{post.comment_count}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {posts.length === 0 && (
              <div className="text-center py-12">
                <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Posts Yet</h3>
                <p className="text-gray-600">
                  {group.is_member 
                    ? 'Be the first to share something with the group!'
                    : 'Join the group to see posts and participate in discussions.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Group Info */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Group Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium capitalize">{group.category.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium capitalize">{group.group_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">
                  {new Date(group.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Members */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Members ({group.member_count})
            </h3>
            <div className="space-y-3">
              {members.slice(0, 8).map((member) => (
                <div key={member.id} className="flex items-center space-x-3">
                  <img
                    src={member.profiles?.avatar_url || 'https://images.pexels.com/photos/1181472/pexels-photo-1181472.jpeg?auto=compress&cs=tinysrgb&w=100'}
                    alt={member.profiles?.full_name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">
                      {member.profiles?.full_name}
                    </div>
                    {member.role !== 'member' && (
                      <div className="text-xs text-orange-600 capitalize">
                        {member.role}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {members.length > 8 && (
                <button className="text-orange-600 text-sm hover:text-orange-700 transition-colors">
                  View all members
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;