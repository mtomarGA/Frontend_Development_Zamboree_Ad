// components/map/MapPicker.jsx
'use client'
import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const MapPicker = ({ onPositionSelect, initialPosition }) => {
    const mapRef = useRef(null)
    const markerRef = useRef(null)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Initialize map
            const map = L.map(mapRef.current).setView(
                initialPosition || [20.5937, 78.9629], // Default to India coordinates
                5
            )

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map)

            // Add click handler
            map.on('click', (e) => {
                const { lat, lng } = e.latlng

                // Remove previous marker if exists
                if (markerRef.current) {
                    map.removeLayer(markerRef.current)
                }

                // Add new marker
                markerRef.current = L.marker([lat, lng], {
                    draggable: true
                }).addTo(map)

                // Call parent handler
                onPositionSelect(lat, lng)
            })

            // If initial position exists, add marker
            if (initialPosition) {
                markerRef.current = L.marker([initialPosition.lat, initialPosition.lng], {
                    draggable: true
                }).addTo(map)
            }

            return () => {
                map.remove()
            }
        }
    }, [initialPosition, onPositionSelect])

    return <div ref={mapRef} className='h-full w-full' />
}

export default MapPicker
