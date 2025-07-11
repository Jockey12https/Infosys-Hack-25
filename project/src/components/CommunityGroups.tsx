import React, { useState, useEffect } from 'react';
import { Users, MessageCircle, Heart, Search, Filter, Plus, MapPin, Camera, BookOpen, Compass, Lightbulb, Globe, X, Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, CommunityGroup } from '../lib/supabase';

const CommunityGroups = () => {
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    name: '',
    description: '',
    category: 'general' as 'general' | 'region' | 'activity' | 'travel_tips' | 'photography' | 'culture',
    group_type: 'public' as 'public' | 'private',
    location: '',
    cover_image: '',
    rules: [''],
    tags: ['']
  });
  const [creating, setCreating] = useState(false);

  const { user } = useAuth();

  const categories = [
    { id: 'all', label: 'All Groups', icon: Globe },
    { id: 'general', label: 'General', icon: MessageCircle },
    { id: 'region', label: 'Regional', icon: MapPin },
    { id: 'activity', label: 'Activities', icon: Compass },
    { id: 'travel_tips', label: 'Travel Tips', icon: Lightbulb },
    { id: 'photography', label: 'Photography', icon: Camera },
    { id: 'culture', label: 'Culture', icon: BookOpen },
  ];

  useEffect(() => {
    fetchGroups();
  }, [selectedCategory, searchTerm]);

  const fetchGroups = async () => {
    try {
      let query = supabase
        .from('community_groups')
        .select(`
          *,
          profiles:created_by (
            full_name,
            avatar_url
          )
        `)
        .eq('is_active', true)
        .order('member_count', { ascending: false });

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Check membership status for authenticated users
      if (user && data) {
        const groupIds = data.map(group => group.id);
        const { data: memberships } = await supabase
          .from('group_members')
          .select('group_id, role')
          .eq('user_id', user.id)
          .in('group_id', groupIds)
          .eq('is_active', true);

        const membershipMap = new Map(
          memberships?.map(m => [m.group_id, m.role]) || []
        );

        const groupsWithMembership = data.map(group => ({
          ...group,
          is_member: membershipMap.has(group.id),
          user_role: membershipMap.get(group.id),
        }));

        setGroups(groupsWithMembership);
      } else {
        setGroups(data || []);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinGroup = async (groupId: string) => {
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
      await fetchGroups();
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const leaveGroup = async (groupId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchGroups();
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };

  const createGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setCreating(true);
    try {
      // Filter out empty rules and tags
      const rules = createFormData.rules.filter(rule => rule.trim() !== '');
      const tags = createFormData.tags.filter(tag => tag.trim() !== '');

      const { error } = await supabase
        .from('community_groups')
        .insert([{
          name: createFormData.name,
          description: createFormData.description,
          category: createFormData.category,
          group_type: createFormData.group_type,
          location: createFormData.location || null,
          cover_image: createFormData.cover_image || null,
          created_by: user.id,
          rules: rules.length > 0 ? rules : null,
          tags: tags.length > 0 ? tags : null,
        }]);

      if (error) throw error;

      // Reset form and close modal
      setCreateFormData({
        name: '',
        description: '',
        category: 'general',
        group_type: 'public',
        location: '',
        cover_image: '',
        rules: [''],
        tags: ['']
      });
      setShowCreateForm(false);
      
      // Refresh groups list
      await fetchGroups();
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Error creating group. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const addRule = () => {
    setCreateFormData({
      ...createFormData,
      rules: [...createFormData.rules, '']
    });
  };

  const removeRule = (index: number) => {
    const newRules = createFormData.rules.filter((_, i) => i !== index);
    setCreateFormData({
      ...createFormData,
      rules: newRules.length > 0 ? newRules : ['']
    });
  };

  const updateRule = (index: number, value: string) => {
    const newRules = [...createFormData.rules];
    newRules[index] = value;
    setCreateFormData({
      ...createFormData,
      rules: newRules
    });
  };

  const addTag = () => {
    setCreateFormData({
      ...createFormData,
      tags: [...createFormData.tags, '']
    });
  };

  const removeTag = (index: number) => {
    const newTags = createFormData.tags.filter((_, i) => i !== index);
    setCreateFormData({
      ...createFormData,
      tags: newTags.length > 0 ? newTags : ['']
    });
  };

  const updateTag = (index: number, value: string) => {
    const newTags = [...createFormData.tags];
    newTags[index] = value;
    setCreateFormData({
      ...createFormData,
      tags: newTags
    });
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(c => c.id === category);
    return categoryData?.icon || Globe;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Community Groups
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Connect with fellow travelers, share experiences, and discover new adventures together
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search groups by name, description, or location..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
            
            {user && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 transition-colors flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Group
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Groups Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading community groups...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {groups.map((group) => {
            const CategoryIcon = getCategoryIcon(group.category);
            
            return (
              <div
                key={group.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48">
                  <img
                    src={group.cover_image || 'https://images.pexels.com/photos/1181472/pexels-photo-1181472.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={group.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <div className="bg-white bg-opacity-90 p-2 rounded-full">
                      <CategoryIcon className="h-5 w-5 text-orange-600" />
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {group.group_type}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {group.name}
                      </h3>
                      {group.location && (
                        <div className="flex items-center text-gray-600 text-sm mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          {group.location}
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
                    {group.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {group.member_count} members
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {group.post_count} posts
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <img
                        src={group.profiles?.avatar_url || 'https://images.pexels.com/photos/1181472/pexels-photo-1181472.jpeg?auto=compress&cs=tinysrgb&w=100'}
                        alt="Creator"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm text-gray-600">
                        by {group.profiles?.full_name || 'Community'}
                      </span>
                    </div>

                    {user ? (
                      group.is_member ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => window.location.href = `/community/groups/${group.id}`}
                            className="bg-green-600 text-white px-4 py-2 rounded-full text-sm hover:bg-green-700 transition-colors"
                          >
                            View Group
                          </button>
                          {group.user_role !== 'admin' && (
                            <button
                              onClick={() => leaveGroup(group.id)}
                              className="border-2 border-red-600 text-red-600 px-4 py-2 rounded-full text-sm hover:bg-red-600 hover:text-white transition-colors"
                            >
                              Leave
                            </button>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => joinGroup(group.id)}
                          className="bg-orange-600 text-white px-6 py-2 rounded-full text-sm hover:bg-orange-700 transition-colors"
                        >
                          Join Group
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => window.location.href = '/auth'}
                        className="bg-orange-600 text-white px-6 py-2 rounded-full text-sm hover:bg-orange-700 transition-colors"
                      >
                        Sign In to Join
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {groups.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Groups Found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedCategory !== 'all'
              ? 'Try adjusting your search or filters.'
              : 'Be the first to create a community group!'}
          </p>
          {user && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 transition-colors"
            >
              Create First Group
            </button>
          )}
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Create New Community</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <form onSubmit={createGroup} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Community Name *
                  </label>
                  <input
                    type="text"
                    value={createFormData.name}
                    onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter community name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={createFormData.description}
                    onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Describe what this community is about..."
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={createFormData.category}
                      onChange={(e) => setCreateFormData({ ...createFormData, category: e.target.value as any })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="general">General</option>
                      <option value="region">Regional</option>
                      <option value="activity">Activities</option>
                      <option value="travel_tips">Travel Tips</option>
                      <option value="photography">Photography</option>
                      <option value="culture">Culture</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Privacy *
                    </label>
                    <select
                      value={createFormData.group_type}
                      onChange={(e) => setCreateFormData({ ...createFormData, group_type: e.target.value as any })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="public">Public - Anyone can join</option>
                      <option value="private">Private - Invite only</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location (Optional)
                  </label>
                  <input
                    type="text"
                    value={createFormData.location}
                    onChange={(e) => setCreateFormData({ ...createFormData, location: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., Kerala, India or Worldwide"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={createFormData.cover_image}
                    onChange={(e) => setCreateFormData({ ...createFormData, cover_image: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {/* Community Rules */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Community Rules</h3>
                  <button
                    type="button"
                    onClick={addRule}
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                  >
                    + Add Rule
                  </button>
                </div>
                
                {createFormData.rules.map((rule, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={rule}
                      onChange={(e) => updateRule(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder={`Rule ${index + 1}`}
                    />
                    {createFormData.rules.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRule(index)}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
                  <button
                    type="button"
                    onClick={addTag}
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                  >
                    + Add Tag
                  </button>
                </div>
                
                {createFormData.tags.map((tag, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => updateTag(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder={`Tag ${index + 1}`}
                    />
                    {createFormData.tags.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:border-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating ? 'Creating...' : 'Create Community'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityGroups;