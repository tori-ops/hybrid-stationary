'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface StationeryItem {
  type: 'invite' | 'rsvp' | 'save_the_date';
  front_image_url: string;
  back_image_url: string;
}

interface StationeryEditorProps {
  items: StationeryItem[];
  onItemsChange: (items: StationeryItem[]) => void;
  userId?: string;
}

export default function StationeryEditor({ items, onItemsChange, userId }: StationeryEditorProps) {
  const [expandedType, setExpandedType] = useState<string | null>(null);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [initialized, setInitialized] = useState(false);

  const stationeryTypes = [
    { value: 'invite', label: 'Invitation' },
    { value: 'rsvp', label: 'RSVP Card' },
    { value: 'save_the_date', label: 'Save The Date' }
  ] as const;

  // Auto-expand sections with existing items - only on initial load
  useEffect(() => {
    if (!initialized && items && items.length > 0) {
      const firstType = items[0]?.type;
      if (firstType) {
        setExpandedType(firstType);
      }
      setInitialized(true);
    }
  }, []);

  const getItemsOfType = (type: string) => items.filter(item => item.type === type);
  const canAddMoreOfType = (type: string) => getItemsOfType(type).length < 2;

  const handleAddStationery = (type: 'invite' | 'rsvp' | 'save_the_date') => {
    if (!canAddMoreOfType(type)) return;
    
    const newItem: StationeryItem = {
      type,
      front_image_url: '',
      back_image_url: ''
    };
    
    onItemsChange([...items, newItem]);
  };

  const handleImageUpload = async (
    index: number,
    side: 'front' | 'back',
    file: File
  ) => {
    if (!userId) return;

    try {
      setLoading({ ...loading, [`${index}-${side}`]: true });

      const timestamp = new Date().getTime();
      const filename = `stationery/${userId}/${items[index].type}-${side}-${timestamp}-${file.name}`;

      const { data, error } = await supabase.storage
        .from('invitations')
        .upload(filename, file, { upsert: true });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('invitations')
        .getPublicUrl(filename);

      const updatedItems = [...items];
      if (side === 'front') {
        updatedItems[index].front_image_url = publicUrlData.publicUrl;
      } else {
        updatedItems[index].back_image_url = publicUrlData.publicUrl;
      }

      onItemsChange(updatedItems);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setLoading({ ...loading, [`${index}-${side}`]: false });
    }
  };

  const handleRemoveItem = (index: number) => {
    onItemsChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Stationery Items</h3>
        
        {stationeryTypes.map(({ value, label }) => {
          const typeItems = getItemsOfType(value);
          const itemCount = typeItems.length;
          const canAdd = canAddMoreOfType(value);

          return (
            <div key={value} className="mb-6 border-b pb-6 last:border-b-0 last:pb-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setExpandedType(expandedType === value ? null : value)}
                    className="text-lg font-semibold text-gray-700 hover:text-gray-900"
                  >
                    {expandedType === value ? '▼' : '▶'} {label}
                  </button>
                  <span className="text-sm text-gray-500">({itemCount}/2)</span>
                </div>
                <button
                  onClick={() => handleAddStationery(value)}
                  disabled={!canAdd}
                  className={`px-3 py-1 rounded text-sm font-medium transition ${
                    canAdd
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  + Add {label}
                </button>
              </div>

              {expandedType === value && (
                <div className="space-y-4 mt-4 ml-4">
                  {typeItems.length === 0 ? (
                    <p className="text-gray-500 text-sm">No {label.toLowerCase()} cards added yet</p>
                  ) : (
                    typeItems.map((item, idx) => {
                      const itemIndex = items.indexOf(item);
                      const displayNumber = typeItems.indexOf(item) + 1;

                      return (
                        <div key={idx} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-medium text-gray-700">{label} #{displayNumber}</span>
                            <button
                              onClick={() => handleRemoveItem(itemIndex)}
                              className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                            >
                              Remove
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            {/* Front Image */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Front Image
                              </label>
                              {item.front_image_url ? (
                                <div className="mb-2">
                                  <img
                                    src={item.front_image_url}
                                    alt={`${label} front`}
                                    className="w-full h-48 object-cover rounded border border-gray-300"
                                  />
                                </div>
                              ) : (
                                <div className="w-full h-48 bg-gray-200 rounded border border-gray-300 flex items-center justify-center mb-2">
                                  <span className="text-gray-500 text-sm">No image</span>
                                </div>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleImageUpload(itemIndex, 'front', file);
                                }}
                                disabled={loading[`${itemIndex}-front`]}
                                className="w-full text-sm"
                              />
                              {loading[`${itemIndex}-front`] && (
                                <p className="text-xs text-blue-500 mt-1">Uploading...</p>
                              )}
                            </div>

                            {/* Back Image */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Back Image
                              </label>
                              {item.back_image_url ? (
                                <div className="mb-2">
                                  <img
                                    src={item.back_image_url}
                                    alt={`${label} back`}
                                    className="w-full h-48 object-cover rounded border border-gray-300"
                                  />
                                </div>
                              ) : (
                                <div className="w-full h-48 bg-gray-200 rounded border border-gray-300 flex items-center justify-center mb-2">
                                  <span className="text-gray-500 text-sm">No image</span>
                                </div>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleImageUpload(itemIndex, 'back', file);
                                }}
                                disabled={loading[`${itemIndex}-back`]}
                                className="w-full text-sm"
                              />
                              {loading[`${itemIndex}-back`] && (
                                <p className="text-xs text-blue-500 mt-1">Uploading...</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
