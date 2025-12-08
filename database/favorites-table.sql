-- Create the favorites table for the Vehicle Favorites/Wishlist System
-- This table links accounts to their favorite inventory items

CREATE TABLE IF NOT EXISTS public.favorites (
    favorite_id INTEGER PRIMARY KEY,
    account_id INTEGER NOT NULL REFERENCES public.account(account_id) ON DELETE CASCADE,
    inv_id INTEGER NOT NULL REFERENCES public.inventory(inv_id) ON DELETE CASCADE,
    date_added TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_favorite UNIQUE (account_id, inv_id)
);


