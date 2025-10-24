// src/screens/RoomService/components/TopBar.tsx
import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TopBarProps {
  room: string;
  onRoomEdit: (newRoom: string) => void;
  isOpen: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ room, onRoomEdit, isOpen }) => {
  const [editing, setEditing] = React.useState(false);
  const [value, setValue] = React.useState(room);

  const save = () => {
    onRoomEdit(value.trim());
    setEditing(false);
  };

  return (
    <View className="bg-white pt-12 pb-4 px-6 shadow-sm">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-xs text-[#7d6f63] mb-1">Room Service</Text>
          
          {editing ? (
            <View className="flex-row items-center gap-2">
              <TextInput
                value={value}
                onChangeText={setValue}
                onSubmitEditing={save}
                className="flex-1 font-semibold border border-[#e6d9cc] rounded-lg px-2 py-1 text-sm"
                placeholder="Hab. 203"
                maxLength={20}
                autoFocus
              />
              <TouchableOpacity onPress={save} className="w-9 h-9 bg-[#f6f0e9] rounded-full items-center justify-center">
                <Ionicons name="checkmark" size={16} color="#7d6f63" />
              </TouchableOpacity>
            </View>
          ) : (
            <View className="flex-row items-center gap-2">
              <Text className="font-semibold">{`Entrega en ${room}`}</Text>
              <TouchableOpacity onPress={() => setEditing(true)} className="w-6 h-6 bg-[#f6f0e9] rounded-full items-center justify-center">
                <Ionicons name="pencil" size={12} color="#7d6f63" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View className={`px-3 py-1 rounded-full ${isOpen ? 'bg-green-100' : 'bg-amber-100'}`}>
          <Text className={`text-xs font-medium ${isOpen ? 'text-green-800' : 'text-amber-800'}`}>
            {isOpen ? 'Abierto' : 'Cerrado'}
          </Text>
        </View>
      </View>
    </View>
  );
};
