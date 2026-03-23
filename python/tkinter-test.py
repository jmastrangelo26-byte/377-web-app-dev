import tkinter as tk

def on_click():
    messageVar.config(text=f"Hello {entry1.get()} {entry2.get()}")

root = tk.Tk()

tk.Label(root, text="First Name").grid(row=0, column=0, padx=5, pady=5, sticky=tk.E)
tk.Label(root, text="Last Name").grid(row=1, column=0, padx=5, pady=5, sticky=tk.E)

entry1 = tk.Entry(root)
entry2 = tk.Entry(root)

entry1.grid(row=0, column=1, padx=5, pady=5, sticky=tk.W)
entry2.grid(row=1, column=1, padx=5, pady=5, sticky=tk.W)

var1 = tk.IntVar()
var2 = tk.IntVar()

# place checkbuttons in column 0/1 so they align with the form
tk.Checkbutton(root, text="Male", variable=var1).grid(row=2, column=0, columnspan=2, sticky=tk.W, padx=5, pady=2)
tk.Checkbutton(root, text="Female", variable=var2).grid(row=3, column=0, columnspan=2, sticky=tk.W, padx=5, pady=2)


messageVar = tk.Message(root, text="", width=200)
messageVar.config(bg='lightgreen', font=('times', 24, 'italic'))
messageVar.grid(row=5, column=0, columnspan=2, padx=5, pady=5)

button = tk.Button(root, text="Do Something", width=25, command=on_click)
button.grid(row=4, column=0, columnspan=2, pady=10)

root.mainloop()