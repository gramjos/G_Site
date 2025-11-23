---
tags: [python, data,]
---
##### running questions:
1. setting the `IFS` back after using in a command line command versus using it in a stand alone script. 
2. how protable is `fzf`? 
###### This document will walk through the process of selecting which drawing to download and then downloading them locally. Then create a web viewer that does an initial inspection. 
> [!info]+ ToC
> 1. Virtual environment
> 2. Download `gsutil`
> 3. 

>
1. Create a virtual environment for `pip` installed packages with `python -m venv ~/.envs/___` (where `___` is the newly create virtual environments name)
		- environment created: `quick_draw`

```shell
source ~/.envs/quick_draw/bin/activate
```

2. download the google suite command line tools requires to pull the bucket called "quickdraw_dataset" 
```shell
curl https://sdk.cloud.google.com | bash
```
The above command downloaded materials lives in `~/.envs/quick_draw/`
Replace the current shell with environment's shell (zsh)
```shell
exec -l $SHELL
```
Launch interactive _Getting Started_ workflow
```shell
gcloud init
```
From the above command's interactive menu: create new project called `quick-draw-me` 
- show the dataset 
```shell
gsutil ls -l gs://quickdraw_dataset/full/binary/
```
- show size 
```shell
gsutil du -s -h gs://quickdraw_dataset/full/binary/
```
- just see file names 
```shell
gsutil ls -l gs://quickdraw_dataset/full/binary/ |awk -F "/" '{print $6}'|column
```

3. download quickdraw_dataset 
	- Shell expansion displays the selected drawings
```shell
time gsutil cp gs://quickdraw_dataset/full/binary/{pig,van,dragon}.bin .
```
outputs...
```
Copying gs://quickdraw_dataset/full/binary/pig.bin...

Copying gs://quickdraw_dataset/full/binary/van.bin...                           

Copying gs://quickdraw_dataset/full/binary/dragon.bin...                        

| [3 files][ 71.8 MiB/ 71.8 MiB]                                                

Operation completed over 3 objects/71.8 MiB.                                     

gsutil cp gs://quickdraw_dataset/full/binary/{pig,van,dragon}.bin .  1.02s user 0.74s system 30% cpu 5.801 total
```

Use `tab` to perform multiple (`--multi`) selection
```shell
gsutil ls -l gs://quickdraw_dataset/full/binary/ |awk -F "/" '{print $6}'|fzf --multi
```

##### TODO: Can the selection from `fzf` be parametrized as the shell expansion to download the from gsutil... solved, yes.
```shell
 gsutil ls -l gs://quickdraw_dataset/full/binary/ |
   awk -F "/" '{print $6}' |
   sed 's/\.bin$//'  |
   fzf --multi  |
   tr '\n' ','  |
   sed 's/.$//'
```

4. exploratory data analysis
	- consists of building tools to visualize the raw data. 