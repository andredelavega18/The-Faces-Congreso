-- Add main_image_url column to speakers table for the center/big image
-- The imageUrl field is for card thumbnail, mainImageUrl is for the large center display

ALTER TABLE speakers
ADD COLUMN IF NOT EXISTS main_image_url TEXT;

-- Add a comment explaining the purpose
COMMENT ON COLUMN speakers.main_image_url IS 'URL of the main/center image for the speaker (larger display)';
