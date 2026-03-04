import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Mental Health Mirror custom colors with dark mode variants
				wellness: {
					green: {
						light: '#8BC34A',
						DEFAULT: '#4CAF50',
						dark: '#2E7D32',
						// Dark mode variants
						'dark-light': '#66BB6A',
						'dark-default': '#4CAF50', 
						'dark-dark': '#388E3C'
					},
					blue: {
						light: '#29B6F6',
						DEFAULT: '#03A9F4',
						dark: '#0288D1',
						// Dark mode variants
						'dark-light': '#42A5F5',
						'dark-default': '#2196F3',
						'dark-dark': '#1976D2'
					},
					yellow: {
						light: '#FFD54F',
						DEFAULT: '#FFC107',
						dark: '#FFA000',
						// Dark mode variants
						'dark-light': '#FFCA28',
						'dark-default': '#FF9800',
						'dark-dark': '#F57C00'
					},
					purple: {
						light: '#B39DDB',
						DEFAULT: '#673AB7',
						dark: '#512DA8',
						// Dark mode variants
						'dark-light': '#9575CD',
						'dark-default': '#9C27B0',
						'dark-dark': '#7B1FA2'
					},
					teal: {
						light: '#80DEEA',
						DEFAULT: '#00BCD4',
						dark: '#0097A7',
						// Dark mode variants
						'dark-light': '#4DB6AC',
						'dark-default': '#009688',
						'dark-dark': '#00695C'
					},
					// Additional colors for better dark mode support
					gray: {
						50: '#F9FAFB',
						100: '#F3F4F6',
						200: '#E5E7EB',
						300: '#D1D5DB',
						400: '#9CA3AF',
						500: '#6B7280',
						600: '#4B5563',
						700: '#374151',
						800: '#1F2937',
						850: '#1A202C',
						900: '#111827',
						950: '#0F0F0F'
					}
				},
				// Theme-aware colors that change based on light/dark mode
				'theme-aware': {
					bg: {
						primary: 'var(--bg-primary)',
						secondary: 'var(--bg-secondary)',
						tertiary: 'var(--bg-tertiary)'
					},
					text: {
						primary: 'var(--text-primary)',
						secondary: 'var(--text-secondary)',
						muted: 'var(--text-muted)'
					},
					border: {
						primary: 'var(--border-primary)',
						secondary: 'var(--border-secondary)'
					}
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'plant-grow': {
					'0%': { transform: 'scale(0.8)', opacity: '0.8' },
					'50%': { transform: 'scale(1.05)', opacity: '1' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				pulse: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' }
				},
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' }
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				'slide-in-left': {
					'0%': { transform: 'translateX(-100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				'bounce-subtle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'plant-grow': 'plant-grow 1.5s ease-out forwards',
				'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'fade-in': 'fade-in 0.5s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'slide-in-left': 'slide-in-left 0.3s ease-out',
				'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite'
			},
			fontFamily: {
				'sans': ['Open Sans', 'ui-sans-serif', 'system-ui'],
				'montserrat': ['Montserrat', 'ui-sans-serif', 'system-ui']
			},
			backgroundImage: {
				// Light mode gradients
				'gradient-wellness-light': 'linear-gradient(135deg, #E8F5E8 0%, #F0F9FF 100%)',
				'gradient-primary-light': 'linear-gradient(135deg, #4CAF50 0%, #03A9F4 100%)',
				'gradient-card-light': 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
				// Dark mode gradients  
				'gradient-wellness-dark': 'linear-gradient(135deg, #1A2332 0%, #0F172A 100%)',
				'gradient-primary-dark': 'linear-gradient(135deg, #2E7D32 0%, #1976D2 100%)',
				'gradient-card-dark': 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)'
			},
			boxShadow: {
				'wellness-sm': '0 1px 3px 0 rgba(76, 175, 80, 0.1), 0 1px 2px 0 rgba(76, 175, 80, 0.06)',
				'wellness-md': '0 4px 6px -1px rgba(76, 175, 80, 0.1), 0 2px 4px -1px rgba(76, 175, 80, 0.06)',
				'wellness-lg': '0 10px 15px -3px rgba(76, 175, 80, 0.1), 0 4px 6px -2px rgba(76, 175, 80, 0.05)',
				'wellness-xl': '0 20px 25px -5px rgba(76, 175, 80, 0.1), 0 10px 10px -5px rgba(76, 175, 80, 0.04)',
				'dark-sm': '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
				'dark-md': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
				'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
				'dark-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		// Custom plugin for theme-aware utilities
		function({ addUtilities, theme }) {
			const newUtilities = {
				'.theme-transition': {
					'transition': 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease'
				},
				'.bg-theme-primary': {
					'background-color': 'var(--bg-primary)'
				},
				'.bg-theme-secondary': {
					'background-color': 'var(--bg-secondary)'
				},
				'.text-theme-primary': {
					'color': 'var(--text-primary)'
				},
				'.text-theme-secondary': {
					'color': 'var(--text-secondary)'
				},
				'.border-theme-primary': {
					'border-color': 'var(--border-primary)'
				}
			}
			addUtilities(newUtilities)
		}
	],
} satisfies Config;