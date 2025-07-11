/*
  # Community Groups System

  1. New Tables
    - `community_groups` - Groups for travelers to join
    - `group_members` - Track group memberships
    - `group_posts` - Posts within groups
    - `post_comments` - Comments on posts
    - `post_likes` - Likes on posts and comments

  2. Security
    - Enable RLS on all tables
    - Users can only see public groups or groups they're members of
    - Only group members can post and comment
    - Users can manage their own posts and comments
*/

-- Community Groups table
CREATE TABLE IF NOT EXISTS community_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  cover_image text,
  group_type text CHECK (group_type IN ('public', 'private')) DEFAULT 'public',
  category text CHECK (category IN ('general', 'region', 'activity', 'travel_tips', 'photography', 'culture')) DEFAULT 'general',
  location text,
  created_by uuid REFERENCES profiles(id) ON DELETE CASCADE,
  member_count integer DEFAULT 0,
  post_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  rules text[],
  tags text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Group Members table
CREATE TABLE IF NOT EXISTS group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES community_groups(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role text CHECK (role IN ('admin', 'moderator', 'member')) DEFAULT 'member',
  joined_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  UNIQUE(group_id, user_id)
);

-- Group Posts table
CREATE TABLE IF NOT EXISTS group_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES community_groups(id) ON DELETE CASCADE,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text,
  content text NOT NULL,
  post_type text CHECK (post_type IN ('text', 'photo', 'experience', 'question', 'tip')) DEFAULT 'text',
  images text[],
  location text,
  tags text[],
  like_count integer DEFAULT 0,
  comment_count integer DEFAULT 0,
  is_pinned boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Post Comments table
CREATE TABLE IF NOT EXISTS post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES group_posts(id) ON DELETE CASCADE,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  parent_comment_id uuid REFERENCES post_comments(id) ON DELETE CASCADE,
  like_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Post Likes table
CREATE TABLE IF NOT EXISTS post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  post_id uuid REFERENCES group_posts(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES post_comments(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, comment_id),
  CHECK ((post_id IS NOT NULL AND comment_id IS NULL) OR (post_id IS NULL AND comment_id IS NOT NULL))
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_community_groups_category ON community_groups(category);
CREATE INDEX IF NOT EXISTS idx_community_groups_location ON community_groups(location);
CREATE INDEX IF NOT EXISTS idx_community_groups_active ON community_groups(is_active);
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_posts_group_id ON group_posts(group_id);
CREATE INDEX IF NOT EXISTS idx_group_posts_author_id ON group_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_group_posts_created_at ON group_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);

-- Enable Row Level Security
ALTER TABLE community_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for community_groups
CREATE POLICY "Public can view public groups"
  ON community_groups
  FOR SELECT
  TO public
  USING (group_type = 'public' AND is_active = true);

CREATE POLICY "Members can view their groups"
  ON community_groups
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT group_id FROM group_members 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Users can create groups"
  ON community_groups
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Group creators can update their groups"
  ON community_groups
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- RLS Policies for group_members
CREATE POLICY "Users can view group memberships"
  ON group_members
  FOR SELECT
  TO authenticated
  USING (
    group_id IN (
      SELECT id FROM community_groups 
      WHERE group_type = 'public' OR id IN (
        SELECT group_id FROM group_members 
        WHERE user_id = auth.uid() AND is_active = true
      )
    )
  );

CREATE POLICY "Users can join groups"
  ON group_members
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage their own membership"
  ON group_members
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Group admins can manage members"
  ON group_members
  FOR ALL
  TO authenticated
  USING (
    group_id IN (
      SELECT group_id FROM group_members 
      WHERE user_id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- RLS Policies for group_posts
CREATE POLICY "Users can view posts in accessible groups"
  ON group_posts
  FOR SELECT
  TO authenticated
  USING (
    group_id IN (
      SELECT id FROM community_groups 
      WHERE group_type = 'public' OR id IN (
        SELECT group_id FROM group_members 
        WHERE user_id = auth.uid() AND is_active = true
      )
    )
  );

CREATE POLICY "Group members can create posts"
  ON group_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    author_id = auth.uid() AND
    group_id IN (
      SELECT group_id FROM group_members 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Users can update their own posts"
  ON group_posts
  FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can delete their own posts"
  ON group_posts
  FOR DELETE
  TO authenticated
  USING (author_id = auth.uid());

-- RLS Policies for post_comments
CREATE POLICY "Users can view comments on accessible posts"
  ON post_comments
  FOR SELECT
  TO authenticated
  USING (
    post_id IN (
      SELECT id FROM group_posts 
      WHERE group_id IN (
        SELECT id FROM community_groups 
        WHERE group_type = 'public' OR id IN (
          SELECT group_id FROM group_members 
          WHERE user_id = auth.uid() AND is_active = true
        )
      )
    )
  );

CREATE POLICY "Group members can comment on posts"
  ON post_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    author_id = auth.uid() AND
    post_id IN (
      SELECT id FROM group_posts 
      WHERE group_id IN (
        SELECT group_id FROM group_members 
        WHERE user_id = auth.uid() AND is_active = true
      )
    )
  );

CREATE POLICY "Users can update their own comments"
  ON post_comments
  FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can delete their own comments"
  ON post_comments
  FOR DELETE
  TO authenticated
  USING (author_id = auth.uid());

-- RLS Policies for post_likes
CREATE POLICY "Users can view likes on accessible content"
  ON post_likes
  FOR SELECT
  TO authenticated
  USING (
    (post_id IS NOT NULL AND post_id IN (
      SELECT id FROM group_posts 
      WHERE group_id IN (
        SELECT id FROM community_groups 
        WHERE group_type = 'public' OR id IN (
          SELECT group_id FROM group_members 
          WHERE user_id = auth.uid() AND is_active = true
        )
      )
    )) OR
    (comment_id IS NOT NULL AND comment_id IN (
      SELECT id FROM post_comments 
      WHERE post_id IN (
        SELECT id FROM group_posts 
        WHERE group_id IN (
          SELECT id FROM community_groups 
          WHERE group_type = 'public' OR id IN (
            SELECT group_id FROM group_members 
            WHERE user_id = auth.uid() AND is_active = true
          )
        )
      )
    ))
  );

CREATE POLICY "Users can like accessible content"
  ON post_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can unlike their own likes"
  ON post_likes
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Functions to update counters
CREATE OR REPLACE FUNCTION update_group_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_groups 
    SET member_count = member_count + 1 
    WHERE id = NEW.group_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_groups 
    SET member_count = member_count - 1 
    WHERE id = OLD.group_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_post_counters()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF TG_TABLE_NAME = 'group_posts' THEN
      UPDATE community_groups 
      SET post_count = post_count + 1 
      WHERE id = NEW.group_id;
    ELSIF TG_TABLE_NAME = 'post_comments' THEN
      UPDATE group_posts 
      SET comment_count = comment_count + 1 
      WHERE id = NEW.post_id;
    ELSIF TG_TABLE_NAME = 'post_likes' AND NEW.post_id IS NOT NULL THEN
      UPDATE group_posts 
      SET like_count = like_count + 1 
      WHERE id = NEW.post_id;
    ELSIF TG_TABLE_NAME = 'post_likes' AND NEW.comment_id IS NOT NULL THEN
      UPDATE post_comments 
      SET like_count = like_count + 1 
      WHERE id = NEW.comment_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF TG_TABLE_NAME = 'group_posts' THEN
      UPDATE community_groups 
      SET post_count = post_count - 1 
      WHERE id = OLD.group_id;
    ELSIF TG_TABLE_NAME = 'post_comments' THEN
      UPDATE group_posts 
      SET comment_count = comment_count - 1 
      WHERE id = OLD.post_id;
    ELSIF TG_TABLE_NAME = 'post_likes' AND OLD.post_id IS NOT NULL THEN
      UPDATE group_posts 
      SET like_count = like_count - 1 
      WHERE id = OLD.post_id;
    ELSIF TG_TABLE_NAME = 'post_likes' AND OLD.comment_id IS NOT NULL THEN
      UPDATE post_comments 
      SET like_count = like_count - 1 
      WHERE id = OLD.comment_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_update_member_count
  AFTER INSERT OR DELETE ON group_members
  FOR EACH ROW EXECUTE FUNCTION update_group_member_count();

CREATE TRIGGER trigger_update_post_count
  AFTER INSERT OR DELETE ON group_posts
  FOR EACH ROW EXECUTE FUNCTION update_post_counters();

CREATE TRIGGER trigger_update_comment_count
  AFTER INSERT OR DELETE ON post_comments
  FOR EACH ROW EXECUTE FUNCTION update_post_counters();

CREATE TRIGGER trigger_update_like_count
  AFTER INSERT OR DELETE ON post_likes
  FOR EACH ROW EXECUTE FUNCTION update_post_counters();

-- Insert sample community groups
INSERT INTO community_groups (name, description, cover_image, category, location, created_by, member_count, post_count) VALUES
('Kerala Backwaters Explorers', 'Share your experiences exploring the beautiful backwaters of Kerala', 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=800', 'region', 'Kerala', (SELECT id FROM profiles LIMIT 1), 156, 23),
('Traditional Cooking Enthusiasts', 'Learn and share traditional cooking techniques from across India', 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800', 'activity', 'India', (SELECT id FROM profiles LIMIT 1), 234, 45),
('Solo Female Travelers India', 'A safe space for solo female travelers to share tips and experiences', 'https://images.pexels.com/photos/1181421/pexels-photo-1181421.jpeg?auto=compress&cs=tinysrgb&w=800', 'travel_tips', 'India', (SELECT id FROM profiles LIMIT 1), 189, 67),
('Village Photography Club', 'Capture and share the beauty of rural India through photography', 'https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg?auto=compress&cs=tinysrgb&w=800', 'photography', 'India', (SELECT id FROM profiles LIMIT 1), 98, 134),
('Rajasthan Desert Adventures', 'Connect with fellow travelers exploring the deserts of Rajasthan', 'https://images.pexels.com/photos/1770775/pexels-photo-1770775.jpeg?auto=compress&cs=tinysrgb&w=800', 'region', 'Rajasthan', (SELECT id FROM profiles LIMIT 1), 145, 29),
('Sustainable Travel Community', 'Promoting eco-friendly and sustainable travel practices', 'https://images.pexels.com/photos/1459334/pexels-photo-1459334.jpeg?auto=compress&cs=tinysrgb&w=800', 'general', 'India', (SELECT id FROM profiles LIMIT 1), 267, 78);