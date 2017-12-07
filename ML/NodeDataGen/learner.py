import snake
import threading
import time

discount = 0.3
actions = snake.actions
states = []
Q = {}

for i in range(snake.x):
	for j in range(snake.y):
		states.append((i,j))

for state in states:
	temp = {}
	for action in actions:
		temp[action] = 0.1
	Q[state] = temp

def do_action(action):
	s = snake.snake
	r = -snake.score
	if action == actions[0]:
		snake.try_move(0,-1)
	elif action == actions[1]:
		snake.try_move(0,1)
	elif action == actions[2]:
		snake.try_move(-1,0)
	elif action == actions[3]:
		snake.try_move(1,0)
	else:
		return
	s2 = snake.snake
	r += snake.score
	return s, action, r, s2

def max_Q(s):
	val = None
	act = None
	for a,q in Q[s].items():
		if val is None or (q > val):
			val = q
			act = a
	return act, val

def inc_Q(s,a,alpha,inc):
	Q[s][a] *= 1 - alpha
	Q[s][a] += alpha * inc

def run():
	global discount
	time.sleep(1)
	alpha = 1
	t = 1
	while True:
		s = snake.snake
		max_act, max_val = max_Q(s)
		(s,a,r,s2) = do_action(max_act)

		max_act, max_val = max_Q(s2)
		inc_Q(s,a,alpha,r+discount*max_val)

		t += 1.0
		alpha = pow(t, -0.1)

		time.sleep(0.01)

t =threading.Thread(target=run)
t.daemon = True
t.start()
snake.start_game()
