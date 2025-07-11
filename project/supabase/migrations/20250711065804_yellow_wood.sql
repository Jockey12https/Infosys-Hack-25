/*
  # Insert Sample Guides Data

  1. Sample Data
    - Insert 6 sample guides with complete profile information
    - Each guide has realistic specialties, languages, and locations
    - All guides are verified and active with good ratings
    - Includes gallery images and availability data

  2. Data Coverage
    - Different states across India (Tamil Nadu, Karnataka, Rajasthan, Kerala, Gujarat, Madhya Pradesh)
    - Various specialties (cooking, farming, crafts, toddy tapping, nature walks, storytelling)
    - Multiple languages and experience levels
    - Realistic pricing and ratings
*/

-- Insert sample guides data
INSERT INTO guides (
  id,
  user_id,
  village,
  district,
  state,
  pincode,
  specialties,
  languages,
  gender,
  years_experience,
  description,
  hourly_rate,
  availability,
  is_verified,
  is_active,
  rating,
  total_reviews,
  total_bookings,
  gallery_images,
  certifications
) VALUES 
(
  gen_random_uuid(),
  NULL, -- No user_id for sample data
  'Kumbakonam',
  'Thanjavur',
  'Tamil Nadu',
  '612001',
  ARRAY['Traditional Cooking', 'Organic Gardening'],
  ARRAY['Tamil', 'English', 'Hindi'],
  'female',
  '10+ years',
  'I am Kamala Devi, a passionate cook who has been preserving traditional Tamil recipes for over 15 years. I learned these recipes from my grandmother and love sharing the authentic flavors of our village with visitors. Join me to cook with wood fire and learn the secrets of South Indian cuisine.',
  450,
  ARRAY['Weekdays', 'Mornings (6AM-12PM)', 'Afternoons (12PM-6PM)'],
  true,
  true,
  4.9,
  127,
  89,
  ARRAY[
    'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=400'
  ],
  ARRAY['Traditional Cooking Certificate', 'Food Safety Training']
),
(
  gen_random_uuid(),
  NULL,
  'Mysore',
  'Mysore',
  'Karnataka',
  '570001',
  ARRAY['Sustainable Farming', 'Organic Gardening', 'Composting'],
  ARRAY['Kannada', 'English', 'Hindi'],
  'male',
  '6-10 years',
  'I am Ravi Kumar, an organic farmer passionate about sustainable agriculture. I have been practicing chemical-free farming for 8 years and love teaching visitors about traditional farming methods, composting, and how to grow healthy food naturally.',
  380,
  ARRAY['Weekdays', 'Weekends', 'Mornings (6AM-12PM)', 'Flexible timing'],
  true,
  true,
  4.8,
  89,
  67,
  ARRAY[
    'https://images.pexels.com/photos/1459334/pexels-photo-1459334.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1595108/pexels-photo-1595108.jpeg?auto=compress&cs=tinysrgb&w=400'
  ],
  ARRAY['Organic Farming Certification', 'Permaculture Design Certificate']
),
(
  gen_random_uuid(),
  NULL,
  'Pushkar',
  'Ajmer',
  'Rajasthan',
  '305022',
  ARRAY['Leaf Weaving', 'Handicrafts', 'Traditional Music'],
  ARRAY['Hindi', 'English', 'Rajasthani'],
  'female',
  '10+ years',
  'I am Meera Sharma, a traditional craftsperson specializing in leaf weaving and handicrafts. I have been practicing these ancient arts for over 12 years and enjoy teaching visitors how to create beautiful items using natural materials found in our desert region.',
  420,
  ARRAY['Weekdays', 'Afternoons (12PM-6PM)', 'Evenings (6PM-9PM)'],
  true,
  true,
  4.9,
  156,
  112,
  ARRAY[
    'https://images.pexels.com/photos/1770775/pexels-photo-1770775.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1181421/pexels-photo-1181421.jpeg?auto=compress&cs=tinysrgb&w=400'
  ],
  ARRAY['Traditional Crafts Master', 'Heritage Arts Certificate']
),
(
  gen_random_uuid(),
  NULL,
  'Wayanad',
  'Wayanad',
  'Kerala',
  '673121',
  ARRAY['Toddy Tapping', 'Nature Walks', 'Traditional Drinks'],
  ARRAY['Malayalam', 'English'],
  'male',
  '6-10 years',
  'I am Arjun Nair, a traditional toddy tapper from the beautiful hills of Wayanad. I learned this ancient art from my father and have been practicing for 7 years. I love sharing the techniques of palm climbing and the cultural significance of toddy in Kerala tradition.',
  350,
  ARRAY['Weekdays', 'Mornings (6AM-12PM)', 'Flexible timing'],
  true,
  true,
  4.7,
  73,
  54,
  ARRAY[
    'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?auto=compress&cs=tinysrgb&w=400'
  ],
  ARRAY['Traditional Skills Certificate', 'Tree Climbing Safety Training']
),
(
  gen_random_uuid(),
  NULL,
  'Sasan Gir',
  'Junagadh',
  'Gujarat',
  '362135',
  ARRAY['Nature Walks', 'Wildlife Spotting', 'Bird Watching'],
  ARRAY['Gujarati', 'Hindi', 'English'],
  'female',
  '3-5 years',
  'I am Priya Patel, a nature enthusiast and wildlife guide from the Gir forest region. I have been exploring these forests for 4 years and love sharing knowledge about local wildlife, plants, and conservation efforts with visitors.',
  400,
  ARRAY['Weekdays', 'Weekends', 'Mornings (6AM-12PM)', 'Afternoons (12PM-6PM)'],
  true,
  true,
  4.8,
  94,
  71,
  ARRAY[
    'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1181421/pexels-photo-1181421.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=400'
  ],
  ARRAY['Wildlife Guide License', 'First Aid Certificate']
),
(
  gen_random_uuid(),
  NULL,
  'Orchha',
  'Tikamgarh',
  'Madhya Pradesh',
  '472246',
  ARRAY['Local Storytelling', 'Traditional Music', 'Folk Dance'],
  ARRAY['Hindi', 'English', 'Bundelkhandi'],
  'male',
  '10+ years',
  'I am Gopal Das, a traditional storyteller and keeper of local folklore. For over 15 years, I have been collecting and sharing the ancient tales, legends, and songs of our region. Join me for an evening of stories that have been passed down through generations.',
  320,
  ARRAY['Weekends', 'Evenings (6PM-9PM)', 'Flexible timing'],
  true,
  true,
  4.9,
  112,
  89,
  ARRAY[
    'https://images.pexels.com/photos/1181472/pexels-photo-1181472.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
  ],
  ARRAY['Folk Arts Master', 'Cultural Heritage Certificate']
);