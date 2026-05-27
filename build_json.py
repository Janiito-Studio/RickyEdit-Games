import json

videos = []

# Regular videos
with open("rickyeworld_raw.txt", "r", encoding="cp1252") as f:
    for line in f:
        line = line.strip()
        if not line:
            continue
        parts = line.split("|||")
        if len(parts) == 3:
            vid_id, title, dur = parts
            try:
                duration = int(float(dur))
            except:
                duration = 0
            videos.append({"id": vid_id, "title": title, "duration": duration})

# Shorts (durations fetched individually)
shorts_data = [
    ("iujCq7i0o48", "#shorts", 29),
    ("AkoM-vszQ8E", "#shorts", 27),
    ("t_yvaSCjEz4", "#shorts", 15),
    ("5yMduFLs8mk", "#shorts", 22),
    ("FQuu6cJJdQM", "#shorts", 43),
    ("VzSJjIOVTw8", "#shorts", 33),
    ("vzQWkCv5j4A", "#shorts", 7),
    ("KOodBCjZu30", "#shorts", 19),
    ("tAsCq9fToNY", "#shorts", 5),
    ("3rYMDEwkVA8", "#shorts", 6),
    ("hSKuOOUHSrg", "#shorts", 8),
]
existing_ids = {v["id"] for v in videos}
for vid_id, title, duration in shorts_data:
    if vid_id not in existing_ids:
        videos.append({"id": vid_id, "title": title, "duration": duration})

print(f"Total videos: {len(videos)}")
with open("rickyeworld_videos.json", "w", encoding="utf-8") as f:
    json.dump(videos, f, ensure_ascii=False, indent=2)
print("JSON saved to rickyeworld_videos.json")
