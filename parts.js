// ============================================
// Rocket Parts Definition
// ============================================

const PARTS = {
    capsule: {
        type: 'capsule',
        name: 'Capsule',
        icon: '🛸',
        mass: 500,
        thrust: 0,
        cost: 5000,
        description: 'Main payload - required for launch',
        color: '#FF6B6B'
    },
    tank: {
        type: 'tank',
        name: 'Fuel Tank',
        icon: '🪣',
        mass: 300,
        thrust: 0,
        cost: 3000,
        description: 'Stores propellant for engine',
        color: '#4ECDC4'
    },
    engine: {
        type: 'engine',
        name: 'Engine',
        icon: '⚙️',
        mass: 200,
        thrust: 1000,
        cost: 2000,
        description: 'Provides thrust for launch',
        color: '#FFE66D'
    },
    parachute: {
        type: 'parachute',
        name: 'Parachute',
        icon: '🪂',
        mass: 50,
        thrust: 0,
        cost: 1000,
        description: 'Auto-deploys for safe landing',
        color: '#95E1D3'
    },
    fins: {
        type: 'fins',
        name: 'Fins',
        icon: '⬆️',
        mass: 30,
        thrust: 0,
        cost: 500,
        description: 'Provides stability during flight',
        color: '#A8E6CF'
    },
    heatshield: {
        type: 'heatshield',
        name: 'Heat Shield',
        icon: '🛡️',
        mass: 100,
        thrust: 0,
        cost: 2000,
        description: 'Protects from heat',
        color: '#FF9500'
    }
};

function createPart(type) {
    if (PARTS[type]) {
        return { ...PARTS[type] };
    }
    return null;
}
