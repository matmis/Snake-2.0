from Tkinter import *
master = Tk()

move_score_min = -0.2
move_score_max = -0.2

width = 20
(x,y) = (20,20)

#up down left right ==> zelfde als in onze Backend
actions = [0,1,2,3]

board = Canvas(master, width=x*width, height=y*width)
print(board)
snake = (3,0)
score = 1
restart = False
move_reward = -0.04

specials = [(10,15,"treat",1)]
cell_scores = {}

def render_grid():
    global specials, width, x, y, player
    for(i,j,c,w) in specials:
        board.create_circle((i+0.5)*width,(j+0.5)*width, width, fill="green")

render_grid()

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

me = board.create_circle((x+0.5)*width,(y+0.5)*width,width,fill="red", tag="snakeHead")

board.grid(row=0, column=0)

def start_game():
    master.mainloop()
