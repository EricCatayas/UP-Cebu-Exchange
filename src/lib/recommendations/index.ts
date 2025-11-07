
/*
Option 1: Content-Based Filtering
Components in Content-Based Recommendation System
    Content Analyzer
        Goal: Represent each artwork in a structured, machine-understandable format.

        What it does:

        Takes unstructured item data (e.g., painting descriptions, artist bios, styles) and extracts structured features.
            
    Profile Learner
        Goal: Build a profile that captures what each user likes.

        What it does:

        Uses user behavior (likes, views, rentals) as training examples.

    Filtering Component
        Goal: Match users with artworks that best fit their profile.

        What it does:

        Computes similarity (e.g., cosine similarity).

        Returns a ranked list of artworks.
    
    Remarks: Too difficult to implement.

Option 2: Similarity Measure
    Goal: Quantify how similar an artwork is to another artwork.

    What it does:

    Computes similarity (e.g., cosine similarity, gower's distance) between artwork features.

    Returns a similarity score.
    
    Remarks: Easier to implement, but less personalized. 
        Simply create a function that computes similarity scores between artworks based on their features (e.g., style, medium, artist).
        User wishlist or last viewed artworks can be used as reference points to recommend similar artworks.
    */