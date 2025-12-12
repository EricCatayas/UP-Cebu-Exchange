'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArtistDTO } from '@/models/Artist';
import { ArtworkDTO } from '@/models/Artwork';
import { StyleDTO } from '@/models/Style';
import { artworkApi } from '@/lib/api/artwork';
import { ARTWORK_STATUS, ARTWORK_STATUSES } from '@/lib/constants';
import { FaPlus } from 'react-icons/fa';
import { getRentalFee, getTagNames } from '@/lib/artwork';

// Todo: test
function EditArtworkForm({
  artwork,
  artists,
  mediums,
  styles,
  tags,
}: {
  artwork: ArtworkDTO;
  artists: ArtistDTO[];
  mediums: string[];
  styles: StyleDTO[];
  tags: string[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: artwork.title || '',
    artistId: artwork.artistId || '',
    artistName: '',
    description: artwork.description || '',
    medium: artwork.medium || '',
    styleId: artwork.styleId || '',
    styleName: '',
    heightCm: artwork.heightCm || '',
    widthCm: artwork.widthCm || '',
    status: artwork.status || ARTWORK_STATUS.AVAILABLE,
    rentalFee3Months: getRentalFee(artwork, 3) || '',
    rentalFee6Months: getRentalFee(artwork, 6) || '',
    rentalFee12Months: getRentalFee(artwork, 12) || '',
    tags: getTagNames(artwork) || [],
  });
  const [newTag, setNewTag] = useState('');
  const [tagOptions, setTagOptions] = useState<string[]>(tags || []);
  const [selectedTags, setSelectedTags] = useState<string[]>(getTagNames(artwork) || []);
  const [isNewArtist, setIsNewArtist] = useState(false);
  const [isNewMedium, setIsNewMedium] = useState(false);
  const [isNewStyle, setIsNewStyle] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState(artwork.images || []);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectStyle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      styleId: value,
    }));
  };

  const handleSelectArtist = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      artistId: value,
    }));
  };

  const handleSelectMedium = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      medium: value,
    }));
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(e.target.value);
  };

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tagOptions.includes(trimmedTag)) {
      setTagOptions((prev) => [...prev, trimmedTag]);
      setSelectedTags((prev) => [...prev, trimmedTag]);
      setNewTag('');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setImages(fileArray);

      // Create preview URLs
      const previewUrls = fileArray.map((file) => URL.createObjectURL(file));
      setImagePreviews(previewUrls);

      // todo: set artwork tags based on image analysis
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleRemoveExistingImage = async (imageId: string) => {
    try {
      await artworkApi.deleteImage(artwork.id, imageId);
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (error) {
      console.error('Error deleting existing image:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const artworkData = {
        title: formData.title || undefined,
        artistId: formData.artistId ? Number(formData.artistId) : undefined,
        artistName: formData.artistName || undefined,
        description: formData.description || undefined,
        medium: formData.medium,
        styleId: formData.styleId ? Number(formData.styleId) : undefined,
        styleName: formData.styleName || undefined,
        heightCm: formData.heightCm ? Number(formData.heightCm) : undefined,
        widthCm: formData.widthCm ? Number(formData.widthCm) : undefined,
        status: formData.status,
        rentalFee3Months: Number(formData.rentalFee3Months),
        rentalFee6Months: Number(formData.rentalFee6Months),
        rentalFee12Months: Number(formData.rentalFee12Months),
        tags: selectedTags,
        images: images,
      };

      console.log('Submitting artwork data:', artworkData);

      await artworkApi.create(artworkData);
      alert('Artwork created successfully!');
      router.push('/inventory');
    } catch (error) {
      console.error('Error creating artwork:', error);
      alert(error instanceof Error ? error.message : 'Failed to create artwork');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isNewArtist) {
      setFormData((prev) => ({
        ...prev,
        artistId: '',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        artistName: '',
      }));
    }
    if (isNewStyle) {
      setFormData((prev) => ({
        ...prev,
        styleId: '',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        styleName: '',
      }));
    }
  }, [isNewArtist, isNewStyle]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Basic Information</h2>

        {/* Image Upload */}
        <div>
          <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
            Artwork Images
          </label>
          <input
            type="file"
            id="images"
            name="images"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {existingImages.length > 0 && (
              <>
                {existingImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.imageUrl}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(image.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </>
            )}
            {imagePreviews.length > 0 && (
              <>
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter artwork title"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter artwork description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between">
              <label htmlFor="medium" className="block text-sm font-medium text-gray-700 mb-1">
                Medium <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsNewMedium(!isNewMedium)}
                className="text-blue-600 text-sm hover:underline"
              >
                {isNewMedium ? 'Select Medium' : 'Add New Medium'}
              </button>
            </div>
            {isNewMedium ? (
              <input
                type="text"
                id="medium"
                name="medium"
                value={formData.medium}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new medium"
              />
            ) : (
              <select
                id="medium"
                name="medium"
                value={formData.medium}
                onChange={handleSelectMedium}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a medium</option>
                {mediums?.map((medium, index) => (
                  <option key={index} value={medium}>
                    {medium}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ARTWORK_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between">
              <label htmlFor="artistId" className="block text-sm font-medium text-gray-700 mb-1">
                Artist
              </label>
              <button
                type="button"
                onClick={() => setIsNewArtist(!isNewArtist)}
                className="text-blue-600 text-sm hover:underline"
              >
                {isNewArtist ? 'Select Artist' : 'Add New Artist'}
              </button>
            </div>
            {isNewArtist ? (
              <input
                type="text"
                id="artistName"
                name="artistName"
                value={formData.artistName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new artist name"
              />
            ) : (
              <select
                id="artistId"
                name="artistId"
                value={formData.artistId}
                onChange={handleSelectArtist}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select artist</option>
                {artists?.map((artist) => (
                  <option key={artist.id} value={artist.id}>
                    {artist.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <div className="flex justify-between">
              <label htmlFor="styleId" className="block text-sm font-medium text-gray-700 mb-1">
                Style
              </label>
              <button
                type="button"
                onClick={() => setIsNewStyle(!isNewStyle)}
                className="text-blue-600 text-sm hover:underline"
              >
                {isNewStyle ? 'Select Style' : 'Add New Style'}
              </button>
            </div>
            {isNewStyle ? (
              <input
                type="text"
                id="styleName"
                name="styleName"
                value={formData.styleName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new style name"
              />
            ) : (
              <select
                id="styleId"
                name="styleId"
                value={formData.styleId}
                onChange={handleSelectStyle}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a style</option>
                {styles?.map((style) => (
                  <option key={style.id} value={style.id}>
                    {style.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Dimensions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Dimensions</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="heightCm" className="block text-sm font-medium text-gray-700 mb-1">
              Height (cm)
            </label>
            <input
              type="number"
              id="heightCm"
              name="heightCm"
              value={formData.heightCm}
              onChange={handleChange}
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter height in cm"
            />
          </div>

          <div>
            <label htmlFor="widthCm" className="block text-sm font-medium text-gray-700 mb-1">
              Width (cm)
            </label>
            <input
              type="number"
              id="widthCm"
              name="widthCm"
              value={formData.widthCm}
              onChange={handleChange}
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter width in cm"
            />
          </div>
        </div>
      </div>

      {/* Rental Fees */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Rental Plans</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="rentalFee3Months" className="block text-sm font-medium text-gray-700 mb-1">
              3 Months Fee (₱) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="rentalFee3Months"
              name="rentalFee3Months"
              value={formData.rentalFee3Months}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="rentalFee6Months" className="block text-sm font-medium text-gray-700 mb-1">
              6 Months Fee (₱) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="rentalFee6Months"
              name="rentalFee6Months"
              value={formData.rentalFee6Months}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="rentalFee12Months" className="block text-sm font-medium text-gray-700 mb-1">
              12 Months Fee (₱) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="rentalFee12Months"
              name="rentalFee12Months"
              value={formData.rentalFee12Months}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Tags</h2>
        <div className="flex flex-wrap gap-3 max-h-60 overflow-y-auto">
          {tagOptions?.map((tag) => (
            <label
              key={tag}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedTags.includes(tag)}
                onChange={() => handleToggleTag(tag)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{tag}</span>
            </label>
          ))}
          {/* Todo: Add Tag */}
          <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
            <input
              type="text"
              value={newTag}
              onChange={handleTagInputChange}
              className="text-sm text-gray-700 focus:outline-none"
              placeholder="New tag"
            />
            <button type="button" onClick={handleAddTag} className="text-blue-600">
              <FaPlus />
            </button>
          </label>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Artwork'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/inventory')}
          className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default EditArtworkForm;
