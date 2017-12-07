from tkinter import *
from random import randint
master = Tk()

move_score_min = -0.2
move_score_max = +0.2

width = 20
(x,y) = (20,20)

#up down left right ==> zelfde als in onze Backend
actions = [0,1,2,3]

board = Canvas(master, width=x*width, height=y*width)
snake = (3,0)
score = 1
restart = False
move_reward = -0.04

treat = None
specials = [(randint(0,x),randint(0,y),"treat",2)]

cell_scores = {}

def render_grid():
	global specials, width, x, y, player, board, treat
	for(i,j,c,w) in specials:
		treat = board.create_oval(i*width,j*width, (i+1)*width, (j+1)*width, fill="green")

render_grid()

def move_treat():
	global treat, specials, x, y
	specials[0] = (randint(0,x),randint(0,y),"treat",1)
	for (i,j,c,w) in specials:
		board.coords(treat, i*width, j*width, (i+1)*width, (j+1)*width)

def try_move(dx, dy):
	global snake, x, y, score, move_reward, me
	new_x = snake[0] + dx
	new_y = snake[1] + dy
	score += move_reward
	print(score)
	print("new_x", new_x, " new_y", new_y, " x", x, " y", y)
	if(new_x >= 0) and (new_x < x) and (new_y >= 0) and (new_y < y):
		board.coords(me, new_x*width, new_y * width, (new_x+1)*width, (new_y+1)*width)
		snake = (new_x, new_y)
	for (i,j,c,w) in specials:
		if new_x == i and new_y == j:
			score -= move_reward
			score += w
			print(score)
			move_treat()

def call_up(event):
    try_move(0,-1)

def call_down(event):
    try_move(0, 1)


def call_left(event):
    try_move(-1, 0)


def call_right(event):
    try_move(1, 0)

master.bind("<Up>", call_up)
master.bind("<Down>", call_down)
master.bind("<Right>", call_right)
master.bind("<Left>", call_left)

me = board.create_oval(snake[0]*width,snake[1]*width,(snake[0]+1)*width,(snake[1]+1)*width, fill="red", tag="snakeHead")

board.grid(row=0, column=0)

def start_game():
    master.mainloop()
