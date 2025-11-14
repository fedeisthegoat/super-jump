import pygame
import sys
import math
from dataclasses import dataclass
from typing import List, Tuple, Dict
from enum import Enum

# Initialize Pygame
pygame.init()

# Constants
WINDOW_WIDTH = 800
WINDOW_HEIGHT = 600
FPS = 60

# Colors
SKY_BLUE = (135, 206, 235)
GRASS_GREEN = (34, 139, 34)
BROWN = (139, 69, 19)
GOLD = (255, 215, 0)
ORANGE = (255, 140, 0)
DARK_GOLD = (184, 134, 11)
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (220, 20, 60)
BLUE = (30, 144, 255)
YELLOW = (255, 255, 0)
LIGHT_BLUE = (173, 216, 230)

# Game States
class GameState(Enum):
    MENU = 0
    PLAYING = 1
    PAUSED = 2
    GAME_OVER = 3
    LEVEL_COMPLETE = 4
    SHOP = 5

@dataclass
class Platform:
    x: float
    y: float
    width: float
    height: float
    color: Tuple[int, int, int]
    has_grass: bool = True
    moving: bool = False
    velocity_x: float = 0
    min_x: float = 0
    max_x: float = 0

@dataclass
class Coin:
    x: float
    y: float
    size: float
    collected: bool = False
    rotation: float = 0

@dataclass
class Enemy:
    x: float
    y: float
    width: float
    height: float
    velocity_x: float
    color: Tuple[int, int, int]
    min_x: float
    max_x: float
    defeated: bool = False

@dataclass
class Skin:
    name: str
    color: Tuple[int, int, int]
    hat_color: Tuple[int, int, int]
    face_color: Tuple[int, int, int]
    overall_color: Tuple[int, int, int]
    button_color: Tuple[int, int, int]
    shoe_color: Tuple[int, int, int]
    cost: int
    description: str

class Player:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y
        self.width = 40
        self.height = 50
        self.velocity_y = 0
        self.velocity_x = 0
        self.is_jumping = False
        self.direction = 'right'
        self.has_shield = False
        self.invincible = False
        self.invincible_timer = 0
        self.animation_frame = 0

    def update(self, keys, platforms, gravity, move_speed, jump_force):
        # Horizontal movement
        self.velocity_x = 0
        if keys[pygame.K_LEFT] or keys[pygame.K_a]:
            self.velocity_x = -move_speed
            self.direction = 'left'
        elif keys[pygame.K_RIGHT] or keys[pygame.K_d]:
            self.velocity_x = move_speed
            self.direction = 'right'

        # Apply gravity
        self.velocity_y += gravity
        self.y += self.velocity_y
        self.x += self.velocity_x

        # Collision with platforms
        self.is_jumping = True
        for platform in platforms:
            if (self.x + self.width > platform.x and
                self.x < platform.x + platform.width and
                self.y + self.height > platform.y and
                self.y + self.height < platform.y + platform.height and
                self.velocity_y >= 0):
                self.y = platform.y - self.height
                self.velocity_y = 0
                self.is_jumping = False

        # Boundary checking
        self.x = max(0, min(self.x, WINDOW_WIDTH - self.width))

        # Update timers
        if self.invincible_timer > 0:
            self.invincible_timer -= 1
        else:
            self.invincible = False

        self.animation_frame += 1

    def jump(self, jump_force):
        if not self.is_jumping:
            self.velocity_y = jump_force
            self.is_jumping = True

    def draw(self, screen, skin: Skin):
        x, y = int(self.x), int(self.y)
        w, h = self.width, self.height

        # Flashing effect when invincible
        if self.invincible and (self.invincible_timer // 5) % 2 == 0:
            return

        # Draw shield
        if self.has_shield:
            pygame.draw.circle(screen, (0, 255, 255), (x + w//2, y + h//2), w//2 + 10, 3)

        # Shoes
        pygame.draw.circle(screen, skin.shoe_color, (x + 8, y + h - 3), 5)
        pygame.draw.circle(screen, skin.shoe_color, (x + w - 8, y + h - 3), 5)

        # Legs (Overalls)
        pygame.draw.rect(screen, skin.overall_color, (x + 8, y + h - 20, 10, 18))
        pygame.draw.rect(screen, skin.overall_color, (x + w - 18, y + h - 20, 10, 18))

        # Body (Shirt)
        pygame.draw.rect(screen, skin.color, (x + 5, y + 20, w - 10, 18))

        # Hands
        pygame.draw.circle(screen, skin.face_color, (x + 3, y + 25), 5)
        pygame.draw.circle(screen, skin.face_color, (x + w - 3, y + 25), 5)

        # Overall straps
        pygame.draw.rect(screen, skin.overall_color, (x + 12, y + 20, 5, 15))
        pygame.draw.rect(screen, skin.overall_color, (x + w - 17, y + 20, 5, 15))

        # Buttons
        pygame.draw.circle(screen, skin.button_color, (x + 14, y + 23), 2)
        pygame.draw.circle(screen, skin.button_color, (x + w - 14, y + 23), 2)

        # Head
        pygame.draw.circle(screen, skin.face_color, (x + w//2, y + 12), 12)

        # Hat
        pygame.draw.ellipse(screen, skin.hat_color, (x + w//2 - 14, y + 5 - 6, 28, 12))
        pygame.draw.ellipse(screen, skin.color, (x + w//2 - 10, y + 8 - 4, 20, 8))
        pygame.draw.ellipse(screen, skin.hat_color, (x + w//2 - 13, y + 8 - 4, 26, 8))

        # Letter on hat
        font = pygame.font.Font(None, 16)
        letter = font.render(skin.name[0], True, WHITE)
        screen.blit(letter, (x + w//2 - 4, y + 2))

        # Eyes
        pygame.draw.circle(screen, BLACK, (x + w//2 - 4, y + 12), 3)
        pygame.draw.circle(screen, BLACK, (x + w//2 + 4, y + 12), 3)

class Game:
    def __init__(self):
        self.screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
        pygame.display.set_caption("🍄 Super Mario Platformer 🍄")
        self.clock = pygame.time.Clock()

        # Game state
        self.state = GameState.MENU
        self.score = 0
        self.lives = 3
        self.current_level = 1
        self.total_coins = 0
        self.current_skin = 'mario'
        self.owned_skins = ['mario']

        # Powerups
        self.powerups = {
            'speed_boost': False,
            'super_jump': False,
            'shield': 0,
            'double_coins': False
        }

        # Skins
        self.skins = {
            'mario': Skin('Mario', RED, (139, 0, 0), (255, 228, 196), BLUE, GOLD, (139, 69, 19), 0, 'The classic hero!'),
            'luigi': Skin('Luigi', (0, 255, 0), (0, 100, 0), (255, 228, 196), (0, 0, 205), GOLD, (139, 69, 19), 100, "Mario's green brother"),
            'peach': Skin('Peach', (255, 182, 193), GOLD, (255, 228, 196), (255, 105, 180), WHITE, (255, 20, 147), 150, 'The elegant princess'),
            'toad': Skin('Toad', RED, WHITE, (255, 228, 196), (65, 105, 225), GOLD, (139, 69, 19), 120, 'The loyal mushroom companion'),
            'wario': Skin('Wario', YELLOW, (139, 139, 0), (255, 228, 196), (128, 0, 128), WHITE, (34, 139, 34), 200, 'The evil doppelganger'),
            'waluigi': Skin('Waluigi', (148, 0, 211), (75, 0, 130), (255, 228, 196), BLACK, GOLD, (139, 69, 0), 200, "Luigi's mysterious rival")
        }

        # Shop items
        self.shop_items = [
            {'id': 'extra_life', 'name': 'Extra Life', 'description': 'Gives you an additional life', 'icon': '❤️', 'cost': 50, 'type': 'consumable'},
            {'id': 'speed_boost', 'name': 'Speed Boost', 'description': 'Move 50% faster', 'icon': '⚡', 'cost': 100, 'type': 'upgrade'},
            {'id': 'super_jump', 'name': 'Super Jump', 'description': 'Jump much higher', 'icon': '📈', 'cost': 150, 'type': 'upgrade'},
            {'id': 'shield', 'name': 'Shield', 'description': 'Protects from one hit', 'icon': '🛡️', 'cost': 80, 'type': 'consumable'},
            {'id': 'double_coins', 'name': 'Double Coins', 'description': 'Double all coins', 'icon': '🪙', 'cost': 200, 'type': 'upgrade'}
        ]

        # Player
        self.player = Player(100, 300)

        # Level data
        self.load_level(1)

        # Fonts
        self.title_font = pygame.font.Font(None, 72)
        self.large_font = pygame.font.Font(None, 48)
        self.medium_font = pygame.font.Font(None, 36)
        self.small_font = pygame.font.Font(None, 24)

    def load_level(self, level_num: int):
        # Level 1 configuration
        self.platforms = [
            Platform(0, 550, 800, 50, BROWN, True),
            Platform(200, 450, 150, 20, GRASS_GREEN, True),
            Platform(400, 350, 150, 20, GRASS_GREEN, True),
            Platform(600, 250, 150, 20, GRASS_GREEN, True),
            Platform(300, 200, 200, 20, GRASS_GREEN, True, True, 1.5, 250, 500),
            Platform(100, 150, 150, 20, GRASS_GREEN, True)
        ]

        self.coins = [
            Coin(250, 400, 20),
            Coin(450, 300, 20),
            Coin(650, 200, 20),
            Coin(400, 150, 20),
            Coin(150, 100, 20)
        ]

        self.enemies = [
            Enemy(400, 310, 30, 30, 2, (139, 0, 0), 400, 550),
            Enemy(200, 410, 30, 30, 2, (139, 0, 0), 200, 350)
        ]

        self.goal = {'x': 150, 'y': 100, 'width': 50, 'height': 50}

        # Reset player
        self.player.x = 100
        self.player.y = 300
        self.player.velocity_y = 0
        self.player.velocity_x = 0
        self.player.is_jumping = False
        self.player.has_shield = self.powerups['shield'] > 0

    def get_move_speed(self):
        return 7.5 if self.powerups['speed_boost'] else 5

    def get_jump_force(self):
        return -20 if self.powerups['super_jump'] else -15

    def draw_platform(self, platform: Platform):
        pygame.draw.rect(self.screen, platform.color, 
                        (platform.x, platform.y, platform.width, platform.height))

        if platform.has_grass:
            for i in range(0, int(platform.width), 10):
                pygame.draw.rect(self.screen, (50, 205, 50), 
                               (platform.x + i, platform.y - 5, 8, 5))

    def draw_coin(self, coin: Coin):
        if not coin.collected:
            coin.rotation += 0.05

            # Draw glowing coin
            for radius in range(int(coin.size//2), int(coin.size//2) + 3):
                color_intensity = 255 - (radius - coin.size//2) * 50
                color = (color_intensity, color_intensity // 2, 0)
                pygame.draw.circle(self.screen, color, 
                                 (int(coin.x), int(coin.y)), radius, 1)

            pygame.draw.circle(self.screen, GOLD, 
                             (int(coin.x), int(coin.y)), int(coin.size//2))
            pygame.draw.circle(self.screen, DARK_GOLD, 
                             (int(coin.x), int(coin.y)), int(coin.size//2), 2)

    def draw_enemy(self, enemy: Enemy):
        if not enemy.defeated:
            x, y = int(enemy.x), int(enemy.y)

            # Body
            pygame.draw.rect(self.screen, enemy.color, 
                           (x, y, int(enemy.width), int(enemy.height)))

            # Eyes
            pygame.draw.circle(self.screen, WHITE, (x + 10, y + 10), 4)
            pygame.draw.circle(self.screen, WHITE, (x + 20, y + 10), 4)
            pygame.draw.circle(self.screen, BLACK, (x + 10, y + 10), 2)
            pygame.draw.circle(self.screen, BLACK, (x + 20, y + 10), 2)

    def draw_goal(self):
        goal = self.goal
        x, y = int(goal['x']), int(goal['y'])

        # Flag pole
        pygame.draw.rect(self.screen, BROWN, (x + 5, y, 5, goal['height']))

        # Flag
        points = [(x + 10, y + 5), (x + 40, y + 15), (x + 10, y + 25)]
        pygame.draw.polygon(self.screen, GOLD, points)

        # Star
        star_text = self.medium_font.render('⭐', True, RED)
        self.screen.blit(star_text, (x + 10, y + 5))

    def draw_hud(self):
        # Background bar
        pygame.draw.rect(self.screen, (239, 68, 68), (10, 10, 780, 60), border_radius=10)
        pygame.draw.rect(self.screen, GOLD, (10, 10, 780, 60), 3, border_radius=10)

        # Stats
        stats = [
            f"⭐ Score: {self.score}",
            f"❤️ Lives: {self.lives}",
            f"🎯 Level: {self.current_level}",
            f"🪙 Coins: {self.total_coins}"
        ]

        for i, stat in enumerate(stats):
            text = self.small_font.render(stat, True, WHITE)
            self.screen.blit(text, (30 + i * 190, 30))

    def draw_menu(self):
        # Title
        title = self.title_font.render("🍄 SUPER MARIO 🍄", True, WHITE)
        title_rect = title.get_rect(center=(WINDOW_WIDTH//2, 150))

        # Shadow effect
        shadow = self.title_font.render("🍄 SUPER MARIO 🍄", True, BLACK)
        shadow_rect = shadow.get_rect(center=(WINDOW_WIDTH//2 + 3, 153))
        self.screen.blit(shadow, shadow_rect)
        self.screen.blit(title, title_rect)

        # Subtitle
        subtitle = self.medium_font.render("PLATFORMER", True, GOLD)
        subtitle_rect = subtitle.get_rect(center=(WINDOW_WIDTH//2, 220))
        self.screen.blit(subtitle, subtitle_rect)

        # Menu options
        options = [
            ("Press SPACE to Start", 320),
            ("Press S for Shop", 370),
            ("Arrow Keys/WASD to Move", 420),
            ("Space/Up/W to Jump", 450)
        ]

        for text, y in options:
            rendered = self.small_font.render(text, True, WHITE)
            rect = rendered.get_rect(center=(WINDOW_WIDTH//2, y))
            self.screen.blit(rendered, rect)

    def draw_game_over(self):
        # Semi-transparent overlay
        overlay = pygame.Surface((WINDOW_WIDTH, WINDOW_HEIGHT))
        overlay.set_alpha(200)
        overlay.fill(BLACK)
        self.screen.blit(overlay, (0, 0))

        # Game Over text
        title = self.large_font.render("GAME OVER! 💀", True, RED)
        title_rect = title.get_rect(center=(WINDOW_WIDTH//2, 200))
        self.screen.blit(title, title_rect)

        # Stats
        score_text = self.medium_font.render(f"Final Score: {self.score}", True, WHITE)
        score_rect = score_text.get_rect(center=(WINDOW_WIDTH//2, 280))
        self.screen.blit(score_text, score_rect)

        level_text = self.medium_font.render(f"Level Reached: {self.current_level}", True, WHITE)
        level_rect = level_text.get_rect(center=(WINDOW_WIDTH//2, 330))
        self.screen.blit(level_text, level_rect)

        # Restart instruction
        restart = self.small_font.render("Press R to Restart", True, GOLD)
        restart_rect = restart.get_rect(center=(WINDOW_WIDTH//2, 400))
        self.screen.blit(restart, restart_rect)

    def draw_level_complete(self):
        # Semi-transparent overlay
        overlay = pygame.Surface((WINDOW_WIDTH, WINDOW_HEIGHT))
        overlay.set_alpha(200)
        overlay.fill(BLACK)
        self.screen.blit(overlay, (0, 0))

        # Title
        title = self.large_font.render("LEVEL COMPLETE! 🎉", True, GOLD)
        title_rect = title.get_rect(center=(WINDOW_WIDTH//2, 200))
        self.screen.blit(title, title_rect)

        # Score
        score_text = self.medium_font.render(f"Score: {self.score}", True, WHITE)
        score_rect = score_text.get_rect(center=(WINDOW_WIDTH//2, 280))
        self.screen.blit(score_text, score_rect)

        # Continue instruction
        continue_text = self.small_font.render("Press SPACE to Continue", True, GOLD)
        continue_rect = continue_text.get_rect(center=(WINDOW_WIDTH//2, 350))
        self.screen.blit(continue_text, continue_rect)

    def update_enemies(self):
        for enemy in self.enemies:
            if not enemy.defeated:
                enemy.x += enemy.velocity_x

                if enemy.x <= enemy.min_x or enemy.x >= enemy.max_x:
                    enemy.velocity_x *= -1

    def update_platforms(self):
        for platform in self.platforms:
            if platform.moving:
                platform.x += platform.velocity_x

                if platform.x <= platform.min_x or platform.x >= platform.max_x:
                    platform.velocity_x *= -1

    def check_collisions(self):
        # Coin collection
        for coin in self.coins:
            if not coin.collected:
                dist = math.sqrt((self.player.x + self.player.width//2 - coin.x)**2 + 
                               (self.player.y + self.player.height//2 - coin.y)**2)
                if dist < coin.size:
                    coin.collected = True
                    coin_value = 2 if self.powerups['double_coins'] else 1
                    self.total_coins += coin_value
                    self.score += 10 * coin_value

        # Enemy collision
        for enemy in self.enemies:
            if not enemy.defeated:
                if (self.player.x < enemy.x + enemy.width and
                    self.player.x + self.player.width > enemy.x and
                    self.player.y < enemy.y + enemy.height and
                    self.player.y + self.player.height > enemy.y):

                    if self.player.has_shield:
                        self.player.has_shield = False
                        self.powerups['shield'] -= 1
                        enemy.defeated = True
                    elif not self.player.invincible:
                        self.lose_life()

        # Goal collision
        goal = self.goal
        if (self.player.x < goal['x'] + goal['width'] and
            self.player.x + self.player.width > goal['x'] and
            self.player.y < goal['y'] + goal['height'] and
            self.player.y + self.player.height > goal['y']):
            self.level_complete()

    def lose_life(self):
        self.lives -= 1

        if self.lives <= 0:
            self.state = GameState.GAME_OVER
        else:
            self.player.invincible = True
            self.player.invincible_timer = 120
            self.player.x = 100
            self.player.y = 300
            self.player.velocity_y = 0

    def level_complete(self):
        self.state = GameState.LEVEL_COMPLETE
        self.score += 100

    def restart_game(self):
        self.score = 0
        self.lives = 3
        self.current_level = 1
        self.state = GameState.MENU
        self.load_level(1)

    def run(self):
        running = True
        keys = pygame.key.get_pressed()

        while running:
            self.clock.tick(FPS)

            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    running = False

                if event.type == pygame.KEYDOWN:
                    if self.state == GameState.MENU:
                        if event.key == pygame.K_SPACE:
                            self.state = GameState.PLAYING

                    elif self.state == GameState.PLAYING:
                        if event.key in [pygame.K_SPACE, pygame.K_UP, pygame.K_w]:
                            self.player.jump(self.get_jump_force())

                    elif self.state == GameState.GAME_OVER:
                        if event.key == pygame.K_r:
                            self.restart_game()

                    elif self.state == GameState.LEVEL_COMPLETE:
                        if event.key == pygame.K_SPACE:
                            self.load_level(1)
                            self.state = GameState.PLAYING

            # Update
            keys = pygame.key.get_pressed()

            if self.state == GameState.PLAYING:
                self.player.update(keys, self.platforms, 0.6, 
                                 self.get_move_speed(), self.get_jump_force())
                self.update_enemies()
                self.update_platforms()
                self.check_collisions()

                # Check if fell off screen
                if self.player.y > WINDOW_HEIGHT:
                    self.lose_life()

            # Draw
            self.screen.fill(SKY_BLUE)

            if self.state == GameState.MENU:
                self.draw_menu()

            elif self.state in [GameState.PLAYING, GameState.LEVEL_COMPLETE]:
                # Draw game elements
                for platform in self.platforms:
                    self.draw_platform(platform)

                for coin in self.coins:
                    self.draw_coin(coin)

                for enemy in self.enemies:
                    self.draw_enemy(enemy)

                self.draw_goal()
                self.player.draw(self.screen, self.skins[self.current_skin])
                self.draw_hud()

                if self.state == GameState.LEVEL_COMPLETE:
                    self.draw_level_complete()

            elif self.state == GameState.GAME_OVER:
                # Draw last game frame
                for platform in self.platforms:
                    self.draw_platform(platform)

                self.player.draw(self.screen, self.skins[self.current_skin])
                self.draw_game_over()

            pygame.display.flip()

        pygame.quit()
        sys.exit()

if __name__ == "__main__":
    game = Game()
    game.run()
