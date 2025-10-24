// src/screens/RoomService/RoomServiceScreen.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    FlatList,
    Alert,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// APIs (reutilizas las existentes)
import { obtenerMenuChips, obtenerMenuPublico } from '../../api/MenuAPI';
import { crearSolicitud } from '../../api/SolicitudesAPI';

// Types
import type { MenuSection, MenuItem as ApiItem, CategoryChip, TagSlug } from '../../types/MenuItem';

// Mapeo de propiedades
import { mapeo2 } from '../../lib/mapPropiedades';

// Hooks
import { useCart } from '../../screens/hooks/useCart';
import { useRestaurantHours } from '../../screens/hooks/useRestaurantHours';
// Components
import { TopBar } from '../../screens/RoomService/TopBar';
import { CategoryChips } from '../../screens/RoomService/CategoryChips';
import { ProductCard } from '../../screens/RoomService/ProductCard';
import { CartBar } from "../../screens/RoomService/CartBar";

const ALL_SLUG = "__all__";

interface RoomServiceScreenProps {
    // Podría recibir props de navegación si es necesario
}

export default function RoomServiceScreen({ }: RoomServiceScreenProps) {
    // Estados básicos
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Datos del menú
    const [sections, setSections] = useState<MenuSection[]>([]);
    const [chips, setChips] = useState<CategoryChip[]>([]);
    const [selectedCatSlug, setSelectedCatSlug] = useState<string>(ALL_SLUG);

    // Filtros
    const [tagFilters, setTagFilters] = useState<TagSlug[]>([]);

    // Room info
    const [room, setRoom] = useState(() => {
        try {
            const datosStr = localStorage.getItem("datosReserva");
            if (!datosStr) return "Habitación";
            const datos = JSON.parse(datosStr);
            const nombreCorto = datos?.propiedad || "";
            return mapeo2[nombreCorto] || nombreCorto || "Habitación";
        } catch {
            return "Habitación";
        }
    });

    // Cart y restaurant state
    const { cart, addToCart, updateQuantity, clearCart, totalItems, subtotal } = useCart();
    const { isOpen } = useRestaurantHours();

    // Notes para el pedido
    const [notes, setNotes] = useState<string>("");

    // Cargar datos iniciales
    const loadMenuData = useCallback(async () => {
        try {
            setError(null);
            const [menu, chipsRes] = await Promise.all([
                obtenerMenuPublico(),
                obtenerMenuChips()
            ]);

            setSections(menu.sections);
            setChips([...chipsRes].sort((a, b) => a.order - b.order));
        } catch (err: any) {
            console.error('Error loading menu:', err);
            setError(err?.message || "No se pudo cargar el menú");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadMenuData();
    }, [loadMenuData]);

    // Refresh handler
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadMenuData();
        setRefreshing(false);
    }, [loadMenuData]);

    // Helper: filtrar por tags
    const matchesTagFilters = useCallback((item: ApiItem) => {
        if (!tagFilters.length) return true;
        const tags = item.tags || [];
        return tagFilters.some(t => tags.includes(t));
    }, [tagFilters]);

    // Secciones filtradas
    const filteredSections = useMemo<MenuSection[]>(() => {
        if (!tagFilters.length) return sections;
        return sections.map(s => ({
            ...s,
            items: (s.items || []).filter(matchesTagFilters)
        })).filter(s => s.items && s.items.length > 0);
    }, [sections, tagFilters, matchesTagFilters]);

    // Categorías con conteo
    const categoriesWithCount = useMemo(() => {
        const ordered = chips.slice().sort((a, b) => a.order - b.order);
        const total = ordered.reduce((acc, c) => acc + (c.count || 0), 0);
        return [
            { slug: ALL_SLUG, label: `Todos (${total})`, order: -1 }
        ].concat(
            ordered.map(c => ({
                slug: c._id,
                label: `${c.name} (${c.count})`,
                order: c.order
            }))
        );
    }, [chips]);

    // Sección seleccionada
    const selectedSection = useMemo(() => {
        if (selectedCatSlug === ALL_SLUG) return null;
        return filteredSections.find(s => s.category.slug === selectedCatSlug) || null;
    }, [filteredSections, selectedCatSlug]);

    // Items a mostrar
    const itemsToShow = useMemo(() => {
        if (selectedCatSlug === ALL_SLUG) {
            // Mostrar todos los items de todas las secciones
            return filteredSections.flatMap(section =>
                (section.items || []).map(item => ({ ...item, sectionName: section.category.name }))
            );
        } else if (selectedSection) {
            return selectedSection.items || [];
        }
        return [];
    }, [selectedCatSlug, filteredSections, selectedSection]);

    // Handlers
    const handleProductClick = (product: ApiItem) => {
        console.log("🍽️ Product clicked:", product);

        if (product.autoToppings?.length) {
            // Aquí deberías abrir un modal de customización
            // Por simplicidad, por ahora solo agregamos sin opciones
            Alert.alert(
                "Personalizar producto",
                "La personalización estará disponible pronto. ¿Agregar sin opciones?",
                [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Agregar", onPress: () => addToCart(product) }
                ]
            );
        } else {
            addToCart(product);
        }
    };

    const handleCategorySelect = (slug: string) => {
        setSelectedCatSlug(slug);
    };

    // Manejo del carrito
    const handleCartPress = () => {
        // Aquí deberías abrir el modal del carrito
        Alert.alert(
            "Carrito de compras",
            `${totalItems} productos por S/${subtotal.toFixed(2)}`,
            [
                { text: "Continuar comprando", style: "cancel" },
                { text: "Confirmar pedido", onPress: handleConfirmOrder }
            ]
        );
    };

    const handleConfirmOrder = async () => {
        if (!cart.length) return;

        try {
            // Obtener datos de reserva
            const datosStr = await AsyncStorage.getItem("datosReserva");
            const datos = datosStr ? JSON.parse(datosStr) : {};

            // Preparar items legibles
            const itemsLegibles = cart.map(item => {
                const lineTotal = item.quantity * item.unitPrice;
                let toppingsText = "";
                if (item.selectedText) {
                    toppingsText = ` (${item.selectedText})`;
                }
                return `${item.quantity} x ${item.name}${toppingsText} — S/${lineTotal.toFixed(2)}`;
            });

            // Info adicional
            const info: string[] = [];
            if (notes) info.push(`Notas: ${notes}`);
            info.push(`Pago: Cargo a habitación ${room}`);
            if (!isOpen) info.push("Programado para apertura");

            const payload = {
                nombre: datos?.nombre,
                dni: datos?.dniPasaporte,
                propiedad: datos?.propiedad,
                telefono: datos?.telefono,
                tipo: "RoomService",
                items: [...itemsLegibles, ...info],
                hora: new Date(),
                meta: {
                    subtotal,
                    total: subtotal,
                    payment: "habitacion",
                    isOpenNow: isOpen,
                    room,
                    items: cart.map(item => ({
                        key: item.key,
                        name: item.name,
                        qty: item.quantity,
                        unitPrice: item.unitPrice,
                        lineTotal: item.quantity * item.unitPrice,
                        selectedToppings: item.selectedToppings
                    }))
                }
            };

            await crearSolicitud(payload);

            Alert.alert(
                "¡Pedido enviado!",
                "Tu pedido ha sido enviado correctamente. Será atendido pronto.",
                [
                    {
                        text: "Ver mis solicitudes",
                        onPress: () => {
                            clearCart();
                            router.push('/(tabs)/solicitudes');
                        }
                    },
                    {
                        text: "OK",
                        onPress: () => clearCart(),
                        style: "cancel"
                    }
                ]
            );

        } catch (error: any) {
            console.error('Error sending order:', error);
            Alert.alert("Error", "No se pudo enviar el pedido. Intenta nuevamente.");
        }
    };

    // Render item para FlatList
    const renderProduct = ({ item }: { item: ApiItem & { sectionName?: string } }) => (
        <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
            {item.sectionName && selectedCatSlug === ALL_SLUG && (
                <Text className="text-xs text-[#7d6f63] mb-2 ml-1">
                    {item.sectionName}
                </Text>
            )}
            <ProductCard product={item} onPress={() => handleProductClick(item)} />
        </View>
    );

    if (loading && !refreshing) {
        return (
            <View className="flex-1 bg-[#f6f0e9] justify-center items-center">
                <ActivityIndicator size="large" color="#F36C3F" />
                <Text className="mt-4 text-[#7d6f63]">Cargando menú...</Text>
            </View>
        );
    }



    return (
        <View className="flex-1 bg-[#f6f0e9]">
            {/* Header */}
            <TopBar
                room={room}
                onRoomEdit={setRoom}
                isOpen={isOpen}
            />

            {/* Category chips */}
            <CategoryChips
                categories={categoriesWithCount}
                selectedCatSlug={selectedCatSlug}
                onCategorySelect={handleCategorySelect}
            />

            {/* Products list */}
            <FlatList
                data={itemsToShow}
                renderItem={renderProduct}
                keyExtractor={(item) => item._id || item.slug}
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#F36C3F"
                    />
                }
                ListEmptyComponent={
                    <View className="flex-1 justify-center items-center py-20">
                        <Text className="text-[#7d6f63] text-center">
                            No hay productos disponibles en esta categoría
                        </Text>
                    </View>
                }
            />

            {/* Cart bar */}
            <CartBar
                totalItems={totalItems}
                subtotal={subtotal}
                isOpen={isOpen}
                onCartOpen={handleCartPress}
            />
        </View>
    );
}